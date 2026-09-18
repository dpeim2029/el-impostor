import Foundation
import Synchronization

// Guardado y recuperación del estado. Espejo de `cargarEstado`/`guardarEstado` en src/game/store.ts.
// La lectura es tolerante: datos viejos o corruptos degradan a valores por defecto, nunca truenan.

public let claveAlmacen = "el-impostor:v1"

/// Almacén clave-valor de texto (UserDefaults en la app, un diccionario en pruebas).
public protocol Almacen: Sendable {
    func leer(_ clave: String) -> String?
    func escribir(_ valor: String, clave: String)
}

/// Almacén en memoria para pruebas y previews.
public final class AlmacenEnMemoria: Almacen {
    private let datos = Mutex<[String: String]>([:])

    public init() {}

    public func leer(_ clave: String) -> String? {
        datos.withLock { $0[clave] }
    }

    public func escribir(_ valor: String, clave: String) {
        datos.withLock { $0[clave] = valor }
    }
}

public func guardarEstado(_ almacen: (any Almacen)?, _ estado: EstadoJuego) {
    guard let almacen else { return }
    guard let datos = try? JSONEncoder().encode(estado),
          let texto = String(data: datos, encoding: .utf8)
    else { return }
    almacen.escribir(texto, clave: claveAlmacen)
}

public func cargarEstado(_ almacen: (any Almacen)?, categorias: [Categoria]) -> EstadoJuego {
    let inicial = EstadoJuego.inicial(categorias: categorias)
    guard let almacen,
          let crudo = almacen.leer(claveAlmacen),
          let datos = crudo.data(using: .utf8),
          let objeto = try? JSONSerialization.jsonObject(with: datos),
          let guardado = objeto as? [String: Any]
    else { return inicial }

    let idsValidos = Set(categorias.map(\.id))
    let ajustesGuardados = guardado["ajustes"] as? [String: Any]

    var activas = inicial.ajustes.categoriasActivas
    if let lista = ajustesGuardados?["categoriasActivas"] as? [Any] {
        activas = lista.compactMap { $0 as? String }.filter { idsValidos.contains($0) }
    }

    var estado = inicial
    if let lista = guardado["jugadores"] as? [Any] {
        estado.jugadores = lista.prefix(Reglas.maxJugadores).compactMap { elemento -> Jugador? in
            guard let dict = elemento as? [String: Any],
                  let id = dict["id"] as? String,
                  let nombre = dict["nombre"] as? String
            else { return nil }
            return Jugador(id: id, nombre: nombre)
        }
    }
    estado.ajustes = Ajustes(
        numImpostores: (ajustesGuardados?["numImpostores"] as? Int) == 2 ? .dos : .uno,
        conPista: (ajustesGuardados?["conPista"] as? Bool) != false,
        categoriasActivas: activas.isEmpty ? inicial.ajustes.categoriasActivas : activas
    )
    if let lista = guardado["palabrasUsadas"] as? [Any] {
        estado.palabrasUsadas = lista.compactMap { $0 as? String }
    }

    // Una ronda a medias se recupera tal cual para no perder la partida si la app se cierra.
    if let faseTexto = guardado["fase"] as? String,
       let fase = Fase(rawValue: faseTexto),
       Fase.deJuego.contains(fase),
       var rondaDict = guardado["ronda"] as? [String: Any],
       rondaDict["palabra"] != nil,
       rondaDict["roles"] is [String: Any],
       let orden = rondaDict["orden"] as? [Any]
    {
        let idsJugadores = Set(estado.jugadores.map(\.id))
        let ordenIds = orden.compactMap { $0 as? String }
        let roles = rondaDict["roles"] as? [String: Any] ?? [:]
        let consistente = ordenIds.count == orden.count
            && ordenIds.allSatisfy { idsJugadores.contains($0) }
            && estado.jugadores.allSatisfy { roles[$0.id] != nil }
        if consistente {
            if !(rondaDict["acusaciones"] is [Any]) { rondaDict["acusaciones"] = [] }
            if !(rondaDict["vuelta"] is Int) { rondaDict["vuelta"] = 1 }
            if let datosRonda = try? JSONSerialization.data(withJSONObject: rondaDict),
               let ronda = try? JSONDecoder().decode(Ronda.self, from: datosRonda)
            {
                estado.fase = fase
                estado.ronda = ronda
                let indice = guardado["indiceReparto"] as? Int ?? 0
                estado.indiceReparto = min(max(0, indice), max(0, estado.jugadores.count - 1))
            }
        }
    }

    return estado
}

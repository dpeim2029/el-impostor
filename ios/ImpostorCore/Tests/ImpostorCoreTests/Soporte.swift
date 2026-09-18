import Foundation
import Synchronization
import Testing
@testable import ImpostorCore

// Ayudas compartidas por las suites; espejo de los helpers de los tests de la web.

/// Banco real del repo (`data/words.es-MX.json`), leído por ruta relativa a este archivo.
enum BancoDelRepo {
    static let url: URL = {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 { url.deleteLastPathComponent() }  // ImpostorCoreTests → Tests → ImpostorCore → ios → repo
        return url.appendingPathComponent("data/words.es-MX.json")
    }()

    static let banco: BancoPalabras = {
        do {
            return try BancoPalabras.cargar(desde: url)
        } catch {
            fatalError("No se pudo cargar \(url.path): \(error)")
        }
    }()

    static var categorias: [Categoria] { banco.categorias }
}

func jugadores(_ n: Int) -> [Jugador] {
    (1...max(n, 1)).prefix(n).map { Jugador(id: "j\($0)", nombre: "Jugador \($0)") }
}

let ajustesBase = Ajustes(
    numImpostores: .uno,
    conPista: true,
    categoriasActivas: BancoDelRepo.categorias.map(\.id)
)

let mini = Categoria(
    id: "mini",
    nombre: "Mini",
    emoji: "x",
    grupos: [GrupoPista(pista: "Italia", palabras: ["Pizza", "Lasaña"])]
)

/// Contexto determinista para el reductor.
func contextoDePrueba(semilla: UInt32 = 1) -> ContextoJuego<LCG> {
    let contador = Contador()
    return ContextoJuego(categorias: BancoDelRepo.categorias, rng: LCG(semilla: semilla)) {
        "id-\(contador.siguiente())"
    }
}

final class Contador: Sendable {
    private let valor = Mutex(0)
    func siguiente() -> Int {
        valor.withLock { $0 += 1; return $0 }
    }
}


func aplicar(_ estado: EstadoJuego, _ acciones: Accion..., contexto: inout ContextoJuego<LCG>) -> EstadoJuego {
    acciones.reduce(estado) { reducir($0, $1, contexto: &contexto) }
}

func conJugadores(_ nombres: [String], contexto: inout ContextoJuego<LCG>) -> EstadoJuego {
    var estado = EstadoJuego.inicial(categorias: BancoDelRepo.categorias)
    for nombre in nombres {
        estado = reducir(estado, .agregarJugador(nombre: nombre), contexto: &contexto)
    }
    return estado
}

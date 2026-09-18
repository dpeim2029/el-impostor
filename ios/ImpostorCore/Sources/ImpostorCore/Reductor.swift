import Foundation

// Transiciones de estado. Espejo de `reducer` en src/game/store.ts.

/// Pantallas a las que se puede ir directamente (sin ronda de por medio).
public enum Destino: Sendable, Equatable {
    case inicio
    case comoJugar
    case ajustes

    var fase: Fase {
        switch self {
        case .inicio: .inicio
        case .comoJugar: .comoJugar
        case .ajustes: .ajustes
        }
    }
}

public enum Accion: Sendable, Equatable {
    case ir(Destino)
    case agregarJugador(nombre: String)
    case quitarJugador(id: String)
    case renombrarJugador(id: String, nombre: String)
    /// `direccion` es -1 (subir) o 1 (bajar); cualquier otro valor se ignora.
    case moverJugador(id: String, direccion: Int)
    case setNumImpostores(NumImpostores)
    case setConPista(Bool)
    case toggleCategoria(id: String)
    case setCategorias(ids: [String])
    case repartir
    case siguienteCarta
    case otraVuelta
    case irAVotar
    case acusar(id: String)
    case verResultado
    case otraRonda
    case cancelarRonda
}

/// Lo que el reductor necesita del exterior: el banco, la aleatoriedad y cómo crear ids.
public struct ContextoJuego<R: FuenteAleatoria>: Sendable {
    public var categorias: [Categoria]
    public var rng: R
    public var nuevoId: @Sendable () -> String

    public init(
        categorias: [Categoria],
        rng: R,
        nuevoId: @escaping @Sendable () -> String = { UUID().uuidString.lowercased() }
    ) {
        self.categorias = categorias
        self.rng = rng
        self.nuevoId = nuevoId
    }
}

extension Ajustes {
    public static func iniciales(categorias: [Categoria]) -> Ajustes {
        Ajustes(numImpostores: .uno, conPista: true, categoriasActivas: categorias.map(\.id))
    }
}

extension EstadoJuego {
    public static func inicial(categorias: [Categoria]) -> EstadoJuego {
        EstadoJuego(
            fase: .inicio,
            jugadores: [],
            ajustes: .iniciales(categorias: categorias),
            ronda: nil,
            indiceReparto: 0,
            palabrasUsadas: []
        )
    }

    /// Baja el número de impostores si ya no alcanzan los jugadores.
    func conImpostoresAjustados() -> EstadoJuego {
        let maximo = maxImpostores(jugadores.count)
        guard ajustes.numImpostores > maximo else { return self }
        var copia = self
        copia.ajustes.numImpostores = maximo
        return copia
    }
}

public func reducir<R: FuenteAleatoria>(
    _ estado: EstadoJuego,
    _ accion: Accion,
    contexto: inout ContextoJuego<R>
) -> EstadoJuego {
    var nuevo = estado

    switch accion {
    case let .ir(destino):
        nuevo.fase = destino.fase

    case let .agregarJugador(nombre):
        let limpio = nombre.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !limpio.isEmpty, estado.jugadores.count < Reglas.maxJugadores else { return estado }
        nuevo.jugadores.append(Jugador(id: contexto.nuevoId(), nombre: limpio))

    case let .quitarJugador(id):
        nuevo.jugadores.removeAll { $0.id == id }
        nuevo = nuevo.conImpostoresAjustados()

    case let .renombrarJugador(id, nombre):
        let limpio = nombre.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !limpio.isEmpty else { return estado }
        if let indice = nuevo.jugadores.firstIndex(where: { $0.id == id }) {
            nuevo.jugadores[indice].nombre = limpio
        }

    case let .moverJugador(id, direccion):
        guard direccion == -1 || direccion == 1,
              let desde = estado.jugadores.firstIndex(where: { $0.id == id })
        else { return estado }
        let hasta = desde + direccion
        guard hasta >= 0, hasta < estado.jugadores.count else { return estado }
        nuevo.jugadores.swapAt(desde, hasta)

    case let .setNumImpostores(numImpostores):
        nuevo.ajustes.numImpostores = numImpostores
        nuevo = nuevo.conImpostoresAjustados()

    case let .setConPista(conPista):
        nuevo.ajustes.conPista = conPista

    case let .toggleCategoria(id):
        if let indice = nuevo.ajustes.categoriasActivas.firstIndex(of: id) {
            nuevo.ajustes.categoriasActivas.remove(at: indice)
        } else {
            nuevo.ajustes.categoriasActivas.append(id)
        }

    case let .setCategorias(ids):
        nuevo.ajustes.categoriasActivas = ids

    case .repartir, .otraRonda:
        guard let (ronda, usadas) = try? crearRonda(
            jugadores: estado.jugadores,
            ajustes: estado.ajustes,
            categorias: contexto.categorias,
            usadas: estado.palabrasUsadas,
            rng: &contexto.rng
        ) else { return estado }
        nuevo.fase = .reparto
        nuevo.ronda = ronda
        nuevo.indiceReparto = 0
        nuevo.palabrasUsadas = usadas

    case .siguienteCarta:
        guard estado.ronda != nil else { return estado }
        let siguiente = estado.indiceReparto + 1
        if siguiente >= estado.jugadores.count {
            nuevo.fase = .ronda
            nuevo.indiceReparto = 0
        } else {
            nuevo.indiceReparto = siguiente
        }

    case .otraVuelta:
        guard estado.ronda != nil else { return estado }
        nuevo.ronda?.vuelta += 1

    case .irAVotar:
        guard estado.ronda != nil else { return estado }
        nuevo.fase = .votacion

    case let .acusar(id):
        guard let ronda = estado.ronda, !ronda.acusaciones.contains(id) else { return estado }
        nuevo.ronda?.acusaciones.append(id)

    case .verResultado:
        guard estado.ronda != nil else { return estado }
        nuevo.fase = .resultado

    case .cancelarRonda:
        nuevo.fase = .ajustes
        nuevo.ronda = nil
        nuevo.indiceReparto = 0
    }

    return nuevo
}

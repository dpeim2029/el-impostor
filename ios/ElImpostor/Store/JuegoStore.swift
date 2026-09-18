import Foundation
import Observation
import ImpostorCore

/// Estado observable de la partida. Cada acción pasa por el reductor y se guarda al instante.
@MainActor
@Observable
final class JuegoStore {
    private(set) var estado: EstadoJuego
    let banco: BancoPalabras
    private let almacen: any Almacen
    private var contexto: ContextoJuego<AleatoriaSistema>

    init(banco: BancoPalabras, almacen: any Almacen = AlmacenUserDefaults()) {
        self.banco = banco
        self.almacen = almacen
        self.contexto = ContextoJuego(categorias: banco.categorias, rng: AleatoriaSistema())
        self.estado = cargarEstado(almacen, categorias: banco.categorias)
    }

    func enviar(_ accion: Accion) {
        let nuevo = reducir(estado, accion, contexto: &contexto)
        guard nuevo != estado else { return }
        estado = nuevo
        guardarEstado(almacen, estado)
    }

    // MARK: Derivados

    /// Hay una ronda en curso: la pantalla no debe apagarse.
    var enJuego: Bool {
        estado.ronda != nil && estado.fase != .ajustes && estado.fase != .inicio
    }

    var categorias: [Categoria] { banco.categorias }

    var validacion: Validacion {
        validarPartida(jugadores: estado.jugadores, ajustes: estado.ajustes)
    }

    var permiteDosImpostores: Bool {
        maxImpostores(estado.jugadores.count) == .dos
    }

    func jugador(_ id: String) -> Jugador? {
        estado.jugadores.first { $0.id == id }
    }

    func nombre(_ id: String) -> String {
        jugador(id)?.nombre ?? "?"
    }
}

/// Persistencia real en UserDefaults, bajo la misma clave y formato JSON que la web.
// UserDefaults es seguro entre hilos aunque el SDK no lo marque Sendable.
nonisolated struct AlmacenUserDefaults: Almacen, @unchecked Sendable {
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func leer(_ clave: String) -> String? {
        defaults.string(forKey: clave)
    }

    func escribir(_ valor: String, clave: String) {
        defaults.set(valor, forKey: clave)
    }
}

// Modelo del juego. Espejo 1:1 de src/game/types.ts para mantener la trazabilidad.

public struct GrupoPista: Codable, Sendable, Equatable, Hashable {
    /// Pista lejana compartida por todas las palabras del grupo.
    public var pista: String
    public var palabras: [String]

    public init(pista: String, palabras: [String]) {
        self.pista = pista
        self.palabras = palabras
    }
}

public struct Categoria: Codable, Sendable, Equatable, Hashable, Identifiable {
    public var id: String
    public var nombre: String
    public var emoji: String
    public var grupos: [GrupoPista]

    public init(id: String, nombre: String, emoji: String, grupos: [GrupoPista]) {
        self.id = id
        self.nombre = nombre
        self.emoji = emoji
        self.grupos = grupos
    }
}

public struct Palabra: Codable, Sendable, Equatable, Hashable {
    public var texto: String
    public var pista: String
    public var categoriaId: String
    public var categoriaNombre: String
    public var categoriaEmoji: String

    public init(texto: String, pista: String, categoriaId: String, categoriaNombre: String, categoriaEmoji: String) {
        self.texto = texto
        self.pista = pista
        self.categoriaId = categoriaId
        self.categoriaNombre = categoriaNombre
        self.categoriaEmoji = categoriaEmoji
    }
}

public struct Jugador: Codable, Sendable, Equatable, Hashable, Identifiable {
    public var id: String
    public var nombre: String

    public init(id: String, nombre: String) {
        self.id = id
        self.nombre = nombre
    }
}

public enum NumImpostores: Int, Codable, Sendable, CaseIterable, Comparable {
    case uno = 1
    case dos = 2

    public static func < (lhs: NumImpostores, rhs: NumImpostores) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

public struct Ajustes: Codable, Sendable, Equatable, Hashable {
    public var numImpostores: NumImpostores
    /// Si el impostor recibe la pista lejana o entra a ciegas.
    public var conPista: Bool
    public var categoriasActivas: [String]

    public init(numImpostores: NumImpostores, conPista: Bool, categoriasActivas: [String]) {
        self.numImpostores = numImpostores
        self.conPista = conPista
        self.categoriasActivas = categoriasActivas
    }
}

public enum Rol: String, Codable, Sendable {
    case civil
    case impostor
}

public struct Ronda: Codable, Sendable, Equatable, Hashable {
    public var palabra: Palabra
    public var roles: [String: Rol]
    /// Ids de jugadores en orden de turno; el primero empieza.
    public var orden: [String]
    /// Ids de jugadores acusados, en orden.
    public var acusaciones: [String]
    public var vuelta: Int

    public init(palabra: Palabra, roles: [String: Rol], orden: [String], acusaciones: [String], vuelta: Int) {
        self.palabra = palabra
        self.roles = roles
        self.orden = orden
        self.acusaciones = acusaciones
        self.vuelta = vuelta
    }
}

public enum Fase: String, Codable, Sendable, CaseIterable {
    case inicio
    case comoJugar = "como-jugar"
    case ajustes
    case reparto
    case ronda
    case votacion
    case resultado

    /// Fases en las que hay una ronda en curso y vale la pena restaurarla al reabrir.
    public static let deJuego: Set<Fase> = [.reparto, .ronda, .votacion, .resultado]
}

public struct EstadoJuego: Codable, Sendable, Equatable, Hashable {
    public var fase: Fase
    public var jugadores: [Jugador]
    public var ajustes: Ajustes
    public var ronda: Ronda?
    /// Índice en `jugadores` del jugador al que le toca ver su carta.
    public var indiceReparto: Int
    /// Claves `categoriaId:texto` de palabras ya jugadas.
    public var palabrasUsadas: [String]

    public init(
        fase: Fase,
        jugadores: [Jugador],
        ajustes: Ajustes,
        ronda: Ronda?,
        indiceReparto: Int,
        palabrasUsadas: [String]
    ) {
        self.fase = fase
        self.jugadores = jugadores
        self.ajustes = ajustes
        self.ronda = ronda
        self.indiceReparto = indiceReparto
        self.palabrasUsadas = palabrasUsadas
    }
}

public struct ResultadoVoto: Sendable, Equatable {
    public var atrapados: [String]
    public var escapados: [String]
    public var civilesAcusados: [String]
    public var ganaronCiviles: Bool

    public init(atrapados: [String], escapados: [String], civilesAcusados: [String], ganaronCiviles: Bool) {
        self.atrapados = atrapados
        self.escapados = escapados
        self.civilesAcusados = civilesAcusados
        self.ganaronCiviles = ganaronCiviles
    }
}

public enum Reglas {
    public static let minJugadores = 3
    public static let maxJugadores = 15
    public static let minJugadoresDosImpostores = 6
}

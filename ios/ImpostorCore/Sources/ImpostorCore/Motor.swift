import Foundation

// Reglas del juego. Espejo de src/game/engine.ts: funciones puras con RNG inyectable.

public enum ErrorMotor: Error, Equatable {
    case sinPalabras
}

/// Copia barajada (Fisher-Yates); no muta el original.
public func barajar<T>(_ items: [T], rng: inout some FuenteAleatoria) -> [T] {
    var copia = items
    guard copia.count > 1 else { return copia }
    for i in stride(from: copia.count - 1, to: 0, by: -1) {
        let j = indiceAleatorio(i + 1, &rng)
        copia.swapAt(i, j)
    }
    return copia
}

public func maxImpostores(_ numJugadores: Int) -> NumImpostores {
    numJugadores >= Reglas.minJugadoresDosImpostores ? .dos : .uno
}

public struct PalabraElegida: Sendable, Equatable {
    public var palabra: Palabra
    /// Lista de usadas después de elegir; se reinicia si ya no quedaban palabras.
    public var usadas: [String]
    public var reinicio: Bool
}

/// Elige una palabra sin repetir. Cuando se agotan las de las categorías activas, libera solo esas.
public func elegirPalabra(
    categorias: [Categoria],
    activas categoriasActivas: [String],
    usadas: [String],
    rng: inout some FuenteAleatoria
) throws(ErrorMotor) -> PalabraElegida {
    let activas = categorias.filter { categoriasActivas.contains($0.id) }
    let fuente = activas.isEmpty ? categorias : activas
    let todas = fuente.flatMap(palabrasDeCategoria)
    guard !todas.isEmpty else { throw .sinPalabras }

    let yaUsadas = Set(usadas)
    var disponibles = todas.filter { !yaUsadas.contains(clavePalabra($0)) }
    var reinicio = false
    var base = usadas

    if disponibles.isEmpty {
        let clavesActivas = Set(todas.map(clavePalabra))
        base = base.filter { !clavesActivas.contains($0) }
        disponibles = todas
        reinicio = true
    }

    let palabra = disponibles[indiceAleatorio(disponibles.count, &rng)]
    return PalabraElegida(palabra: palabra, usadas: base + [clavePalabra(palabra)], reinicio: reinicio)
}

/// Reparte roles; nunca deja a todos como impostores.
public func asignarRoles(
    _ jugadores: [Jugador],
    numImpostores: Int,
    rng: inout some FuenteAleatoria
) -> [String: Rol] {
    let cuantos = min(numImpostores, max(1, jugadores.count - 1))
    let impostores = Set(barajar(jugadores, rng: &rng).prefix(cuantos).map(\.id))
    var roles: [String: Rol] = [:]
    for jugador in jugadores {
        roles[jugador.id] = impostores.contains(jugador.id) ? .impostor : .civil
    }
    return roles
}

/// Orden de turno: empieza alguien al azar y sigue el orden en que están sentados.
public func ordenDeRonda(_ jugadores: [Jugador], rng: inout some FuenteAleatoria) -> [String] {
    guard !jugadores.isEmpty else { return [] }
    let inicio = indiceAleatorio(jugadores.count, &rng)
    return jugadores.indices.map { jugadores[(inicio + $0) % jugadores.count].id }
}

public func crearRonda(
    jugadores: [Jugador],
    ajustes: Ajustes,
    categorias: [Categoria],
    usadas: [String],
    rng: inout some FuenteAleatoria
) throws(ErrorMotor) -> (ronda: Ronda, usadas: [String]) {
    let eleccion = try elegirPalabra(
        categorias: categorias,
        activas: ajustes.categoriasActivas,
        usadas: usadas,
        rng: &rng
    )
    let numImpostores = min(ajustes.numImpostores, maxImpostores(jugadores.count))
    let ronda = Ronda(
        palabra: eleccion.palabra,
        roles: asignarRoles(jugadores, numImpostores: numImpostores.rawValue, rng: &rng),
        orden: ordenDeRonda(jugadores, rng: &rng),
        acusaciones: [],
        vuelta: 1
    )
    return (ronda, eleccion.usadas)
}

/// Ids de los impostores, en el orden de turno de la ronda (los diccionarios no tienen orden).
public func impostoresDe(_ ronda: Ronda) -> [String] {
    var vistos = Set<String>()
    var resultado: [String] = []
    for id in ronda.orden where ronda.roles[id] == .impostor && vistos.insert(id).inserted {
        resultado.append(id)
    }
    // Defensa: impostores que no estén en `orden` (no debería pasar) se agregan ordenados.
    for (id, rol) in ronda.roles.sorted(by: { $0.key < $1.key }) where rol == .impostor && !vistos.contains(id) {
        resultado.append(id)
    }
    return resultado
}

public func acusacionesPermitidas(_ ronda: Ronda) -> Int {
    impostoresDe(ronda).count
}

public func resolverVoto(_ ronda: Ronda, acusaciones: [String]? = nil) -> ResultadoVoto {
    let acusaciones = acusaciones ?? ronda.acusaciones
    let impostores = impostoresDe(ronda)
    let atrapados = impostores.filter { acusaciones.contains($0) }
    let escapados = impostores.filter { !acusaciones.contains($0) }
    let civilesAcusados = acusaciones.filter { ronda.roles[$0] == .civil }
    return ResultadoVoto(
        atrapados: atrapados,
        escapados: escapados,
        civilesAcusados: civilesAcusados,
        ganaronCiviles: escapados.isEmpty
    )
}

/// Motivos por los que una partida no puede empezar. El cliente los traduce a texto.
public enum ErrorPartida: Sendable, Equatable, CaseIterable {
    case pocosJugadores
    case demasiadosJugadores
    case nombreVacio
    case nombresRepetidos
    case dosImpostoresRequierenSeis
    case sinCategorias
}

public struct Validacion: Sendable, Equatable {
    public var valido: Bool
    public var errores: [ErrorPartida]
}

public func validarPartida(jugadores: [Jugador], ajustes: Ajustes) -> Validacion {
    var errores: [ErrorPartida] = []
    if jugadores.count < Reglas.minJugadores {
        errores.append(.pocosJugadores)
    }
    if jugadores.count > Reglas.maxJugadores {
        errores.append(.demasiadosJugadores)
    }
    let nombres = jugadores.map { nombreNormalizado($0.nombre) }
    if nombres.contains(where: \.isEmpty) {
        errores.append(.nombreVacio)
    }
    if Set(nombres).count != nombres.count {
        errores.append(.nombresRepetidos)
    }
    if ajustes.numImpostores > maxImpostores(jugadores.count) {
        errores.append(.dosImpostoresRequierenSeis)
    }
    if ajustes.categoriasActivas.isEmpty {
        errores.append(.sinCategorias)
    }
    return Validacion(valido: errores.isEmpty, errores: errores)
}

func nombreNormalizado(_ nombre: String) -> String {
    nombre.trimmingCharacters(in: .whitespacesAndNewlines).lowercased(with: Locale(identifier: "es"))
}

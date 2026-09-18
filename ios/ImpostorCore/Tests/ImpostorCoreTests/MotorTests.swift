import Testing
@testable import ImpostorCore

@Suite("barajar")
struct BarajarTests {
    @Test("conserva los elementos y no muta el original")
    func conservaElementos() {
        let original = [1, 2, 3, 4, 5]
        var rng = LCG()
        let resultado = barajar(original, rng: &rng)
        #expect(resultado.count == 5)
        #expect(resultado.sorted() == [1, 2, 3, 4, 5])
        #expect(original == [1, 2, 3, 4, 5])
    }
}

@Suite("maxImpostores")
struct MaxImpostoresTests {
    @Test("permite 2 impostores solo con 6 o más jugadores")
    func limite() {
        #expect(maxImpostores(3) == .uno)
        #expect(maxImpostores(5) == .uno)
        #expect(maxImpostores(6) == .dos)
        #expect(maxImpostores(15) == .dos)
    }
}

@Suite("elegirPalabra")
struct ElegirPalabraTests {
    let categorias = BancoDelRepo.categorias

    @Test("solo elige palabras de las categorías activas")
    func soloActivas() throws {
        var rng = LCG(semilla: 7)
        for _ in 0..<50 {
            let eleccion = try elegirPalabra(categorias: categorias, activas: ["comida"], usadas: [], rng: &rng)
            #expect(eleccion.palabra.categoriaId == "comida")
        }
    }

    @Test("no repite palabras hasta agotar la categoría y luego reinicia")
    func noRepite() throws {
        var rng = LCG(semilla: 3)
        var usadas: [String] = []
        var vistas = Set<String>()
        let primera = try elegirPalabra(categorias: [mini], activas: ["mini"], usadas: usadas, rng: &rng)
        usadas = primera.usadas
        vistas.insert(primera.palabra.texto)
        let segunda = try elegirPalabra(categorias: [mini], activas: ["mini"], usadas: usadas, rng: &rng)
        usadas = segunda.usadas
        vistas.insert(segunda.palabra.texto)
        #expect(vistas.count == 2)
        #expect(segunda.reinicio == false)

        let tercera = try elegirPalabra(categorias: [mini], activas: ["mini"], usadas: usadas, rng: &rng)
        #expect(tercera.reinicio == true)
        #expect(tercera.usadas == [clavePalabra(tercera.palabra)])
    }

    @Test("al reiniciar conserva las usadas de otras categorías")
    func conservaOtras() throws {
        var rng = LCG(semilla: 5)
        let otra = clavePalabra(categoriaId: "comida", texto: "Pizza")
        let usadas = [otra] + palabrasDeCategoria(mini).map(clavePalabra)
        let eleccion = try elegirPalabra(categorias: [mini] + categorias, activas: ["mini"], usadas: usadas, rng: &rng)
        #expect(eleccion.reinicio == true)
        #expect(eleccion.usadas.contains(otra))
    }

    @Test("cae en todas las categorías si ninguna activa existe")
    func caeEnTodas() throws {
        var rng = LCG()
        let eleccion = try elegirPalabra(categorias: categorias, activas: ["no-existe"], usadas: [], rng: &rng)
        #expect(!eleccion.palabra.texto.isEmpty)
    }

    @Test("cada palabra elegida trae su pista lejana y categoría")
    func traePista() throws {
        var rng = LCG(semilla: 11)
        let eleccion = try elegirPalabra(categorias: categorias, activas: ["animales"], usadas: [], rng: &rng)
        #expect(!eleccion.palabra.pista.isEmpty)
        #expect(eleccion.palabra.categoriaNombre == "Animales")
    }

    @Test("sin palabras lanza error")
    func sinPalabras() {
        var rng = LCG()
        #expect(throws: ErrorMotor.sinPalabras) {
            try elegirPalabra(categorias: [], activas: [], usadas: [], rng: &rng)
        }
    }
}

@Suite("asignarRoles")
struct AsignarRolesTests {
    @Test("asigna exactamente el número de impostores pedido")
    func exacto() {
        var rng = LCG(semilla: 2)
        let roles = asignarRoles(jugadores(7), numImpostores: 2, rng: &rng)
        #expect(roles.values.filter { $0 == .impostor }.count == 2)
        #expect(roles.count == 7)
    }

    @Test("nunca deja a todos como impostores")
    func nuncaTodos() {
        var rng = LCG(semilla: 2)
        let roles = asignarRoles(jugadores(3), numImpostores: 5, rng: &rng)
        #expect(roles.values.filter { $0 == .civil }.count > 0)
    }

    @Test("reparte el rol de impostor de forma variada entre jugadores")
    func variado() {
        var rng = LCG(semilla: 42)
        var conteo: [String: Int] = [:]
        for _ in 0..<300 {
            let roles = asignarRoles(jugadores(4), numImpostores: 1, rng: &rng)
            let impostor = roles.first { $0.value == .impostor }!.key
            conteo[impostor, default: 0] += 1
        }
        #expect(conteo.count == 4)
        for veces in conteo.values { #expect(veces > 30) }
    }
}

@Suite("ordenDeRonda")
struct OrdenDeRondaTests {
    @Test("respeta el orden de asientos a partir de un inicio aleatorio")
    func respetaAsientos() {
        var rng = Constante(0.5)
        #expect(ordenDeRonda(jugadores(5), rng: &rng) == ["j3", "j4", "j5", "j1", "j2"])
    }

    @Test("devuelve vacío sin jugadores")
    func vacio() {
        var rng = AleatoriaSistema()
        #expect(ordenDeRonda([], rng: &rng) == [])
    }
}

@Suite("crearRonda")
struct CrearRondaTests {
    @Test("limita los impostores según el número de jugadores")
    func limita() throws {
        var rng = LCG(semilla: 9)
        var ajustes = ajustesBase
        ajustes.numImpostores = .dos
        let (ronda, _) = try crearRonda(jugadores: jugadores(4), ajustes: ajustes, categorias: BancoDelRepo.categorias, usadas: [], rng: &rng)
        #expect(impostoresDe(ronda).count == 1)
        #expect(acusacionesPermitidas(ronda) == 1)
        #expect(ronda.vuelta == 1)
        #expect(ronda.acusaciones == [])
    }

    @Test("con 6 jugadores y 2 impostores crea 2 impostores")
    func dosImpostores() throws {
        var rng = LCG(semilla: 9)
        var ajustes = ajustesBase
        ajustes.numImpostores = .dos
        let (ronda, usadas) = try crearRonda(jugadores: jugadores(6), ajustes: ajustes, categorias: BancoDelRepo.categorias, usadas: [], rng: &rng)
        #expect(impostoresDe(ronda).count == 2)
        #expect(usadas == [clavePalabra(ronda.palabra)])
    }
}

@Suite("resolverVoto")
struct ResolverVotoTests {
    let ronda = Ronda(
        palabra: palabrasDeCategoria(mini)[0],
        roles: ["j1": .civil, "j2": .impostor, "j3": .civil, "j4": .impostor, "j5": .civil, "j6": .civil],
        orden: ["j1", "j2", "j3", "j4", "j5", "j6"],
        acusaciones: [],
        vuelta: 1
    )

    @Test("los civiles ganan solo si atrapan a todos los impostores")
    func ganan() {
        #expect(resolverVoto(ronda, acusaciones: ["j2", "j4"]) == ResultadoVoto(
            atrapados: ["j2", "j4"], escapados: [], civilesAcusados: [], ganaronCiviles: true
        ))
    }

    @Test("un impostor libre significa derrota para los civiles")
    func derrota() {
        let resultado = resolverVoto(ronda, acusaciones: ["j2", "j1"])
        #expect(resultado.atrapados == ["j2"])
        #expect(resultado.escapados == ["j4"])
        #expect(resultado.civilesAcusados == ["j1"])
        #expect(resultado.ganaronCiviles == false)
    }

    @Test("usa las acusaciones de la ronda por defecto")
    func porDefecto() {
        var conAcusacion = ronda
        conAcusacion.acusaciones = ["j3"]
        #expect(resolverVoto(conAcusacion).ganaronCiviles == false)
    }

    @Test("lista a los impostores en orden de turno")
    func ordenDeTurno() {
        var girada = ronda
        girada.orden = ["j4", "j5", "j6", "j1", "j2", "j3"]
        #expect(impostoresDe(girada) == ["j4", "j2"])
    }
}

@Suite("validarPartida")
struct ValidarPartidaTests {
    @Test("acepta una partida bien configurada")
    func acepta() {
        #expect(validarPartida(jugadores: jugadores(4), ajustes: ajustesBase) == Validacion(valido: true, errores: []))
    }

    @Test("rechaza pocos jugadores, nombres vacíos o repetidos")
    func rechazaNombres() {
        let validacion = validarPartida(
            jugadores: [Jugador(id: "a", nombre: "Ana"), Jugador(id: "b", nombre: " ana ")],
            ajustes: ajustesBase
        )
        #expect(validacion.errores.contains(.pocosJugadores))
        #expect(validacion.errores.contains(.nombresRepetidos))
        let conVacio = validarPartida(jugadores: jugadores(3) + [Jugador(id: "x", nombre: "  ")], ajustes: ajustesBase)
        #expect(conVacio.errores.contains(.nombreVacio))
    }

    @Test("rechaza 2 impostores con menos de 6 jugadores y cero categorías")
    func rechazaImpostoresYCategorias() {
        let ajustes = Ajustes(numImpostores: .dos, conPista: true, categoriasActivas: [])
        let validacion = validarPartida(jugadores: jugadores(5), ajustes: ajustes)
        #expect(validacion.errores.contains(.dosImpostoresRequierenSeis))
        #expect(validacion.errores.contains(.sinCategorias))
    }

    @Test("rechaza más de 15 jugadores")
    func rechazaMuchos() {
        #expect(validarPartida(jugadores: jugadores(16), ajustes: ajustesBase).errores.contains(.demasiadosJugadores))
    }
}

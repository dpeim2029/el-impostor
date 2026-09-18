import Testing
@testable import ImpostorCore

@Suite("reducer: jugadores")
struct ReductorJugadoresTests {
    @Test("agrega jugadores recortando espacios e ignora vacíos")
    func agrega() {
        var contexto = contextoDePrueba()
        let estado = conJugadores(["  Ana ", "", "Luis"], contexto: &contexto)
        #expect(estado.jugadores.map(\.nombre) == ["Ana", "Luis"])
        #expect(Set(estado.jugadores.map(\.id)).count == 2)
    }

    @Test("no pasa de 15 jugadores")
    func maximo() {
        var contexto = contextoDePrueba()
        let estado = conJugadores((0..<20).map { "J\($0)" }, contexto: &contexto)
        #expect(estado.jugadores.count == 15)
    }

    @Test("mueve, renombra y quita jugadores")
    func mueveRenombraQuita() {
        var contexto = contextoDePrueba()
        var estado = conJugadores(["Ana", "Luis", "Sofi"], contexto: &contexto)
        let ana = estado.jugadores[0], luis = estado.jugadores[1]
        estado = aplicar(estado, .moverJugador(id: luis.id, direccion: -1), contexto: &contexto)
        #expect(estado.jugadores.map(\.nombre) == ["Luis", "Ana", "Sofi"])
        estado = aplicar(estado, .moverJugador(id: luis.id, direccion: -1), contexto: &contexto)
        #expect(estado.jugadores[0].id == luis.id)
        estado = aplicar(estado, .renombrarJugador(id: ana.id, nombre: " Anita "), contexto: &contexto)
        #expect(estado.jugadores.first { $0.id == ana.id }?.nombre == "Anita")
        estado = aplicar(estado, .quitarJugador(id: luis.id), contexto: &contexto)
        #expect(estado.jugadores.map(\.nombre) == ["Anita", "Sofi"])
    }

    @Test("baja a 1 impostor si ya no alcanzan los jugadores")
    func bajaImpostores() {
        var contexto = contextoDePrueba()
        var estado = conJugadores(["A", "B", "C", "D", "E", "F"], contexto: &contexto)
        estado = aplicar(estado, .setNumImpostores(.dos), contexto: &contexto)
        #expect(estado.ajustes.numImpostores == .dos)
        estado = aplicar(estado, .quitarJugador(id: estado.jugadores[0].id), contexto: &contexto)
        #expect(estado.ajustes.numImpostores == .uno)
    }

    @Test("no permite 2 impostores con menos de 6 jugadores")
    func noPermiteDos() {
        var contexto = contextoDePrueba()
        let estado = aplicar(conJugadores(["A", "B", "C"], contexto: &contexto), .setNumImpostores(.dos), contexto: &contexto)
        #expect(estado.ajustes.numImpostores == .uno)
    }
}

@Suite("reducer: ajustes")
struct ReductorAjustesTests {
    @Test("alterna y fija categorías")
    func categorias() {
        var contexto = contextoDePrueba()
        let inicial = EstadoJuego.inicial(categorias: BancoDelRepo.categorias)
        var estado = aplicar(inicial, .toggleCategoria(id: "comida"), contexto: &contexto)
        #expect(!estado.ajustes.categoriasActivas.contains("comida"))
        estado = aplicar(estado, .toggleCategoria(id: "comida"), contexto: &contexto)
        #expect(estado.ajustes.categoriasActivas.contains("comida"))
        estado = aplicar(estado, .setCategorias(ids: ["animales"]), contexto: &contexto)
        #expect(estado.ajustes.categoriasActivas == ["animales"])
    }

    @Test("activa y desactiva la pista del impostor")
    func pista() {
        var contexto = contextoDePrueba()
        let inicial = EstadoJuego.inicial(categorias: BancoDelRepo.categorias)
        #expect(inicial.ajustes.conPista == true)
        let estado = aplicar(inicial, .setConPista(false), contexto: &contexto)
        #expect(estado.ajustes.conPista == false)
    }

    @Test("ir cambia de pantalla")
    func ir() {
        var contexto = contextoDePrueba()
        let inicial = EstadoJuego.inicial(categorias: BancoDelRepo.categorias)
        #expect(aplicar(inicial, .ir(.comoJugar), contexto: &contexto).fase == .comoJugar)
        #expect(aplicar(inicial, .ir(.ajustes), contexto: &contexto).fase == .ajustes)
    }
}

@Suite("reducer: flujo de una ronda")
struct ReductorFlujoTests {
    @Test("reparte cartas, avanza por cada jugador y pasa a la ronda")
    func reparte() {
        var contexto = contextoDePrueba()
        let base = conJugadores(["Ana", "Luis", "Sofi", "Beto"], contexto: &contexto)
        var estado = aplicar(base, .repartir, contexto: &contexto)
        #expect(estado.fase == .reparto)
        #expect(estado.ronda != nil)
        #expect(estado.indiceReparto == 0)
        #expect(estado.palabrasUsadas.count == 1)
        #expect(estado.ronda!.roles.values.filter { $0 == .impostor }.count == 1)

        for i in 1..<4 {
            estado = aplicar(estado, .siguienteCarta, contexto: &contexto)
            #expect(estado.indiceReparto == i)
            #expect(estado.fase == .reparto)
        }
        estado = aplicar(estado, .siguienteCarta, contexto: &contexto)
        #expect(estado.fase == .ronda)
    }

    @Test("cuenta vueltas, vota y muestra resultado")
    func vota() {
        var contexto = contextoDePrueba()
        let base = conJugadores(["Ana", "Luis", "Sofi", "Beto"], contexto: &contexto)
        var estado = aplicar(base, .repartir, .otraVuelta, .irAVotar, contexto: &contexto)
        #expect(estado.ronda?.vuelta == 2)
        #expect(estado.fase == .votacion)
        let primero = estado.jugadores[0]
        estado = aplicar(estado, .acusar(id: primero.id), .acusar(id: primero.id), contexto: &contexto)
        #expect(estado.ronda?.acusaciones == [primero.id])
        estado = aplicar(estado, .verResultado, contexto: &contexto)
        #expect(estado.fase == .resultado)
    }

    @Test("otra ronda cambia de palabra y cancelar vuelve a ajustes")
    func otraRonda() {
        var contexto = contextoDePrueba()
        let base = conJugadores(["Ana", "Luis", "Sofi", "Beto"], contexto: &contexto)
        var estado = aplicar(base, .repartir, contexto: &contexto)
        let primera = estado.ronda!.palabra
        estado = aplicar(estado, .otraRonda, contexto: &contexto)
        #expect(estado.fase == .reparto)
        #expect(estado.palabrasUsadas.count == 2)
        #expect(estado.ronda!.palabra != primera)
        estado = aplicar(estado, .cancelarRonda, contexto: &contexto)
        #expect(estado.fase == .ajustes)
        #expect(estado.ronda == nil)
    }

    @Test("ignora acciones de ronda cuando no hay ronda")
    func ignora() {
        var contexto = contextoDePrueba()
        let base = conJugadores(["Ana", "Luis", "Sofi", "Beto"], contexto: &contexto)
        #expect(aplicar(base, .siguienteCarta, contexto: &contexto) == base)
        #expect(aplicar(base, .irAVotar, contexto: &contexto) == base)
        #expect(aplicar(base, .acusar(id: "x"), contexto: &contexto) == base)
        #expect(aplicar(base, .otraVuelta, contexto: &contexto) == base)
        #expect(aplicar(base, .verResultado, contexto: &contexto) == base)
    }
}

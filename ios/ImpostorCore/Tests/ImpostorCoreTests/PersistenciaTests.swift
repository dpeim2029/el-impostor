import Foundation
import Testing
@testable import ImpostorCore

@Suite("persistencia")
struct PersistenciaTests {
    let categorias = BancoDelRepo.categorias
    var inicial: EstadoJuego { .inicial(categorias: categorias) }

    @Test("devuelve el estado inicial sin almacén o con datos corruptos")
    func inicialSinAlmacen() {
        #expect(cargarEstado(nil, categorias: categorias) == inicial)
        let almacen = AlmacenEnMemoria()
        almacen.escribir("{no es json", clave: claveAlmacen)
        #expect(cargarEstado(almacen, categorias: categorias) == inicial)
        almacen.escribir("[1, 2, 3]", clave: claveAlmacen)
        #expect(cargarEstado(almacen, categorias: categorias) == inicial)
    }

    @Test("guarda y recupera jugadores, ajustes y palabras usadas")
    func guardaYRecupera() {
        var contexto = contextoDePrueba()
        let almacen = AlmacenEnMemoria()
        let estado = aplicar(
            conJugadores(["Ana", "Luis", "Sofi"], contexto: &contexto),
            .setCategorias(ids: ["comida", "categoria-inexistente"]),
            .setConPista(false),
            .repartir,
            contexto: &contexto
        )
        guardarEstado(almacen, estado)
        let recuperado = cargarEstado(almacen, categorias: categorias)
        #expect(recuperado.jugadores == estado.jugadores)
        #expect(recuperado.ajustes.categoriasActivas == ["comida"])
        #expect(recuperado.ajustes.conPista == false)
        #expect(recuperado.palabrasUsadas == estado.palabrasUsadas)
        #expect(recuperado.fase == .reparto)
        #expect(recuperado.ronda == estado.ronda)
    }

    @Test("descarta una ronda inconsistente con los jugadores guardados")
    func descartaRonda() throws {
        var contexto = contextoDePrueba()
        let almacen = AlmacenEnMemoria()
        var estado = aplicar(conJugadores(["Ana", "Luis", "Sofi"], contexto: &contexto), .repartir, contexto: &contexto)
        estado.jugadores = Array(estado.jugadores.prefix(2))
        guardarEstado(almacen, estado)
        let recuperado = cargarEstado(almacen, categorias: categorias)
        #expect(recuperado.fase == .inicio)
        #expect(recuperado.ronda == nil)
        #expect(recuperado.jugadores.count == 2)
    }

    @Test("si no quedan categorías válidas vuelve a todas")
    func vuelveATodas() {
        let almacen = AlmacenEnMemoria()
        almacen.escribir(#"{"ajustes":{"categoriasActivas":["nada"],"numImpostores":7}}"#, clave: claveAlmacen)
        let recuperado = cargarEstado(almacen, categorias: categorias)
        #expect(recuperado.ajustes.categoriasActivas == inicial.ajustes.categoriasActivas)
        #expect(recuperado.ajustes.numImpostores == .uno)
        #expect(recuperado.ajustes.conPista == true)
    }

    @Test("al pasar de la versión 1 se suma México a quien juega en México")
    func migracionV1() {
        let almacen = AlmacenEnMemoria()
        almacen.escribir(#"{"ajustes":{"numImpostores":1,"conPista":true,"categoriasActivas":["comida"]}}"#, clave: claveAlmacen)
        #expect(cargarEstado(almacen, categorias: categorias, region: "MX").ajustes.categoriasActivas == ["comida", "mexico"])
        #expect(cargarEstado(almacen, categorias: categorias, region: "CL").ajustes.categoriasActivas == ["comida"])
    }

    @Test("respeta que el jugador haya apagado una categoría que ya conocía")
    func respetaApagada() {
        var contexto = contextoDePrueba()
        let almacen = AlmacenEnMemoria()
        let estado = aplicar(
            .inicial(categorias: categorias, region: "MX"),
            .toggleCategoria(id: "mexico"),
            contexto: &contexto
        )
        guardarEstado(almacen, estado)
        let recuperado = cargarEstado(almacen, categorias: categorias, region: "MX")
        #expect(!recuperado.ajustes.categoriasActivas.contains("mexico"))
        #expect(recuperado.ajustes.categoriasConocidas?.contains("mexico") == true)
    }

    @Test("cambiar de idioma no reactiva una categoría regional apagada")
    func cambioDeIdioma() throws {
        let url = BancoDelRepo.url.deletingLastPathComponent().appendingPathComponent("words.en.json")
        let ingles = try BancoPalabras.cargar(desde: url).categorias
        var contexto = contextoDePrueba()
        let almacen = AlmacenEnMemoria()

        // En México, en español, el jugador apaga "México"; luego abre la app en inglés y vuelve.
        guardarEstado(almacen, aplicar(.inicial(categorias: categorias, region: "MX"), .toggleCategoria(id: "mexico"), contexto: &contexto))
        guardarEstado(almacen, cargarEstado(almacen, categorias: ingles, region: "MX"))
        #expect(!cargarEstado(almacen, categorias: categorias, region: "MX").ajustes.categoriasActivas.contains("mexico"))

        // Lo mismo con "USA" en EE. UU., empezando en inglés.
        let otro = AlmacenEnMemoria()
        guardarEstado(otro, aplicar(.inicial(categorias: ingles, region: "US"), .toggleCategoria(id: "usa"), contexto: &contexto))
        guardarEstado(otro, cargarEstado(otro, categorias: categorias, region: "US"))
        #expect(!cargarEstado(otro, categorias: ingles, region: "US").ajustes.categoriasActivas.contains("usa"))
    }

    @Test("el JSON guardado es compatible con la web")
    func formatoWeb() throws {
        let almacen = AlmacenEnMemoria()
        var contexto = contextoDePrueba()
        let estado = aplicar(conJugadores(["Ana", "Luis", "Sofi"], contexto: &contexto), .ir(.comoJugar), contexto: &contexto)
        guardarEstado(almacen, estado)
        let texto = try #require(almacen.leer(claveAlmacen))
        let objeto = try #require(try JSONSerialization.jsonObject(with: Data(texto.utf8)) as? [String: Any])
        #expect(objeto["fase"] as? String == "como-jugar")
        #expect((objeto["ajustes"] as? [String: Any])?["numImpostores"] as? Int == 1)
        #expect((objeto["jugadores"] as? [[String: Any]])?.count == 3)
    }
}

import Foundation
import Testing
import ImpostorCore
@testable import ElImpostor

@Suite("JuegoStore")
struct JuegoStoreTests {
    let banco = try! BancoPalabras.cargar(en: .main)

    @Test("guarda tras cada acción y restaura al crear otro store")
    func persiste() throws {
        let almacen = AlmacenEnMemoria()
        let store = JuegoStore(banco: banco, almacen: almacen)
        store.enviar(.agregarJugador(nombre: "Ana"))
        store.enviar(.agregarJugador(nombre: "Luis"))
        #expect(almacen.leer(claveAlmacen) != nil)

        let otro = JuegoStore(banco: banco, almacen: almacen)
        #expect(otro.estado.jugadores.map(\.nombre) == ["Ana", "Luis"])
    }

    @Test("enJuego es falso en inicio y ajustes, verdadero con ronda")
    func enJuego() {
        let store = JuegoStore(banco: banco, almacen: AlmacenEnMemoria())
        #expect(store.enJuego == false)
        for nombre in ["Ana", "Luis", "Sofi"] { store.enviar(.agregarJugador(nombre: nombre)) }
        store.enviar(.ir(.ajustes))
        #expect(store.enJuego == false)
        store.enviar(.repartir)
        #expect(store.enJuego == true)
        store.enviar(.cancelarRonda)
        #expect(store.enJuego == false)
    }

    @Test("el bundle trae los bancos en español e inglés con sus categorías regionales")
    func bancosDelBundle() throws {
        #expect(banco.idioma == "es-MX")
        #expect(banco.categorias.count == 13)
        #expect(banco.idsDeCategorias.contains("mexico"))
        let ingles = try BancoPalabras.cargar(idioma: "en", en: .main)
        #expect(ingles.idioma == "en")
        #expect(ingles.categorias.count == 13)
        #expect(ingles.idsDeCategorias.contains("usa"))
    }
}

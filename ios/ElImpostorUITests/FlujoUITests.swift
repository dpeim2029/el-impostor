import XCTest

/// Recorre una partida completa en el simulador: jugadores, reparto con la carta mantenida,
/// ronda, votación, resultado y otra ronda. También comprueba que la partida sobrevive a relanzar la app.
final class FlujoUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--reiniciar"]
        app.launch()
    }

    func testPartidaCompleta() {
        // Inicio → Nueva partida
        app.buttons["jugar"].tap()
        XCTAssertTrue(app.staticTexts["Nueva partida"].waitForExistence(timeout: 3))

        // Sin jugadores el botón principal está deshabilitado
        let repartir = app.buttons["repartirCartas"]
        XCTAssertFalse(repartir.isEnabled)

        for nombre in ["Ana", "Luis", "Sofi"] {
            let campo = app.textFields["nombreJugador"]
            campo.tap()
            campo.typeText(nombre)
            app.buttons["agregarJugador"].tap()
        }
        XCTAssertTrue(app.buttons["jugador-Sofi"].waitForExistence(timeout: 2))
        XCTAssertTrue(repartir.isEnabled)
        repartir.tap()

        // Reparto: 3 cartas. "Pasar el teléfono" solo se habilita tras mantener el dedo.
        for posicion in 1...3 {
            XCTAssertTrue(app.staticTexts["\(posicion) de 3"].waitForExistence(timeout: 3))
            let pasar = app.buttons["pasarTelefono"]
            XCTAssertFalse(pasar.isEnabled, "la carta \(posicion) aún no se ha visto")
            app.buttons["zonaDelDedo"].press(forDuration: 0.8)
            XCTAssertTrue(pasar.waitForExistence(timeout: 2))
            XCTAssertTrue(pasar.isEnabled, "tras ver la carta \(posicion) se puede pasar el teléfono")
            pasar.tap()
        }

        // Ronda
        XCTAssertTrue(app.staticTexts["Ronda"].waitForExistence(timeout: 3))
        XCTAssertTrue(app.staticTexts["empieza"].exists)
        app.buttons["otraVuelta"].tap()
        XCTAssertTrue(app.staticTexts["Vuelta 2"].waitForExistence(timeout: 2))
        app.buttons["votar"].tap()

        // Votación: acusar a Ana y confirmar
        XCTAssertTrue(app.staticTexts["¿Quién es el impostor?"].waitForExistence(timeout: 3))
        app.buttons["acusar-Ana"].tap()
        let confirmar = app.buttons["Acusar"]
        XCTAssertTrue(confirmar.waitForExistence(timeout: 3))
        confirmar.tap()

        // Revelación y resultado
        XCTAssertTrue(app.descendants(matching: .any)["revelacion"].waitForExistence(timeout: 3))
        app.buttons["siguiente"].tap()
        XCTAssertTrue(app.staticTexts["Resultado"].waitForExistence(timeout: 3))
        XCTAssertTrue(app.descendants(matching: .any)["veredicto"].exists)

        // Otra ronda vuelve al reparto con una palabra nueva
        app.buttons["otraRonda"].tap()
        XCTAssertTrue(app.staticTexts["1 de 3"].waitForExistence(timeout: 3))

        // La partida sobrevive a cerrar y reabrir la app
        app.terminate()
        app.launchArguments = []
        app.launch()
        XCTAssertTrue(app.staticTexts["1 de 3"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.staticTexts["Pásale el teléfono a"].exists)
    }

    func testCancelarRondaVuelveAAjustes() {
        app.buttons["jugar"].tap()
        for nombre in ["Ana", "Luis", "Sofi"] {
            let campo = app.textFields["nombreJugador"]
            campo.tap()
            campo.typeText(nombre)
            app.buttons["agregarJugador"].tap()
        }
        app.buttons["repartirCartas"].tap()
        XCTAssertTrue(app.buttons["cancelarRonda"].waitForExistence(timeout: 3))
        app.buttons["cancelarRonda"].tap()
        let confirmar = app.buttons["Cancelar la ronda"]
        XCTAssertTrue(confirmar.waitForExistence(timeout: 3))
        confirmar.tap()
        XCTAssertTrue(app.staticTexts["Nueva partida"].waitForExistence(timeout: 3))
        XCTAssertTrue(app.buttons["jugador-Ana"].exists)
    }
}

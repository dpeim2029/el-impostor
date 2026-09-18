import Testing
@testable import ImpostorCore

@Suite("tipos")
struct TiposTests {
    @Test("Fase serializa igual que la web")
    func faseSerializa() throws {
        #expect(Fase.comoJugar.rawValue == "como-jugar")
        #expect(Fase.deJuego.contains(.reparto))
        #expect(!Fase.deJuego.contains(.ajustes))
    }
}

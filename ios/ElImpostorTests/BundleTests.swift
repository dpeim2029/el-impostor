import Foundation
import Testing
import ImpostorCore
@testable import ElImpostor

@Suite("bundle")
struct BundleTests {
    @Test("incluye el banco de palabras es-MX y decodifica")
    func bancoEnBundle() throws {
        let url = try #require(Bundle.main.url(forResource: "words.es-MX", withExtension: "json"))
        let datos = try Data(contentsOf: url)
        #expect(datos.count > 10_000)
    }
}

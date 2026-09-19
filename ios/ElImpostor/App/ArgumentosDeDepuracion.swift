import Foundation
import ImpostorCore

/// Argumentos de lanzamiento para pruebas y capturas. Solo tienen efecto en compilaciones Debug.
///
/// - `--reiniciar`: borra el estado guardado antes de arrancar.
/// - `--fase <inicio|como-jugar|ajustes>`: abre esa pantalla al arrancar.
/// - `--mostrar-carta`: la carta del reparto aparece visible sin mantener el dedo (para capturas).
enum ArgumentosDeDepuracion {
    #if DEBUG
    private static let argumentos = CommandLine.arguments
    #else
    private static let argumentos: [String] = []
    #endif

    static var reiniciar: Bool { argumentos.contains("--reiniciar") }

    static var mostrarCarta: Bool { argumentos.contains("--mostrar-carta") }

    static var faseInicial: Destino? {
        guard let indice = argumentos.firstIndex(of: "--fase"), indice + 1 < argumentos.count else { return nil }
        switch argumentos[indice + 1] {
        case "inicio": return .inicio
        case "como-jugar": return .comoJugar
        case "ajustes": return .ajustes
        default: return nil
        }
    }
}

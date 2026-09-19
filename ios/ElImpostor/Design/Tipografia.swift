import SwiftUI
import UIKit

// Escala tipográfica. SF Pro con pesos fuertes; los títulos y nombres van en mayúsculas (se aplica
// con `.textCase(.uppercase)` en la vista). Los tamaños escalan con Dynamic Type hasta el tope.
enum Tipografia {
    /// Tamaños de accesibilidad más grandes rompen las cartas y los botones de una sola línea.
    static let topeDeTamano = DynamicTypeSize.accessibility2

    /// Escala un tamaño en puntos según el ajuste de texto del usuario, acotado al tope.
    static func escalado(_ puntos: CGFloat, como estilo: UIFont.TextStyle = .body) -> CGFloat {
        let preferida = UIApplication.shared.preferredContentSizeCategory
        let tope = UIContentSizeCategory.accessibilityMedium
        let categoria = preferida > tope ? tope : preferida
        let rasgos = UITraitCollection(preferredContentSizeCategory: categoria)
        return UIFontMetrics(forTextStyle: estilo).scaledValue(for: puntos, compatibleWith: rasgos)
    }
}

extension Font {
    /// "EL IMPOSTOR" en el inicio.
    static var tituloApp: Font { .system(size: Tipografia.escalado(58, como: .largeTitle), weight: .black) }
    /// Nombre del jugador en mayúsculas (reparto, ronda).
    static var nombre: Font { .system(size: Tipografia.escalado(44, como: .largeTitle), weight: .black) }
    /// Encabezado mediano (¿Quién es el impostor?).
    static var encabezadoMedio: Font { .system(size: Tipografia.escalado(28, como: .title1), weight: .heavy) }
    /// La palabra secreta en la carta.
    static var palabra: Font { .system(size: Tipografia.escalado(56, como: .largeTitle), weight: .black) }
    /// "ERES EL IMPOSTOR" en la carta.
    static var impostor: Font { .system(size: Tipografia.escalado(36, como: .largeTitle), weight: .black) }
    /// Título de una tarjeta modal.
    static var modalTitulo: Font { .system(size: Tipografia.escalado(30, como: .title1), weight: .bold) }
    /// Título de una hoja.
    static var hojaTitulo: Font { .system(size: Tipografia.escalado(22, como: .title2), weight: .bold) }
    /// Etiqueta de botón principal.
    static var boton: Font { .system(size: Tipografia.escalado(17, como: .headline), weight: .semibold) }
    /// Filas destacadas.
    static var fila: Font { .system(size: Tipografia.escalado(17, como: .body), weight: .semibold) }
    /// Texto normal.
    static var cuerpo: Font { .system(size: Tipografia.escalado(17, como: .body)) }
    /// Texto de apoyo.
    static var apoyo: Font { .system(size: Tipografia.escalado(15, como: .subheadline)) }
    /// Etiquetas pequeñas en mayúsculas.
    static var etiqueta: Font { .system(size: Tipografia.escalado(13, como: .caption1), weight: .semibold) }
    /// Texto dentro de una pastilla.
    static var pastilla: Font { .system(size: Tipografia.escalado(16, como: .callout), weight: .semibold) }
}

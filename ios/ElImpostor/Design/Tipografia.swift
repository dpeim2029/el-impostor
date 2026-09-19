import SwiftUI
import UIKit

// Escala tipográfica. La app usa SF Rounded (`.fontDesign(.rounded)` en la raíz) y diferencia
// jerarquías por peso y tamaño, como la web con Geist. Los tamaños escalan con Dynamic Type
// hasta el tope que fija la app (ver `Tipografia.topeDeTamano`).
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
    /// Título de la app en el inicio.
    static var tituloApp: Font { .system(size: Tipografia.escalado(44, como: .largeTitle), weight: .heavy) }
    /// Nombre del jugador o encabezado grande de pantalla.
    static var encabezado: Font { .system(size: Tipografia.escalado(34, como: .largeTitle), weight: .heavy) }
    /// Encabezado mediano (¿Quién es el impostor?, veredicto).
    static var encabezadoMedio: Font { .system(size: Tipografia.escalado(28, como: .title1), weight: .heavy) }
    /// La palabra secreta en la carta.
    static var palabra: Font { .system(size: Tipografia.escalado(40, como: .largeTitle), weight: .heavy) }
    /// La pista lejana.
    static var pista: Font { .system(size: Tipografia.escalado(24, como: .title2), weight: .bold) }
    /// Título de sección.
    static var seccion: Font { .system(size: Tipografia.escalado(18, como: .headline), weight: .bold) }
    /// Etiqueta de botón principal.
    static var boton: Font { .system(size: Tipografia.escalado(18, como: .headline), weight: .semibold) }
    /// Filas y botones secundarios.
    static var fila: Font { .system(size: Tipografia.escalado(17, como: .body), weight: .semibold) }
    /// Texto normal.
    static var cuerpo: Font { .system(size: Tipografia.escalado(17, como: .body)) }
    /// Texto de apoyo.
    static var apoyo: Font { .system(size: Tipografia.escalado(14, como: .footnote)) }
    /// Etiquetas pequeñas en mayúsculas.
    static var etiqueta: Font { .system(size: Tipografia.escalado(12, como: .caption1), weight: .semibold) }
}

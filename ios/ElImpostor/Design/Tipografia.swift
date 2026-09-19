import SwiftUI

// Escala tipográfica. La app usa SF Rounded (`.fontDesign(.rounded)` en la raíz) y diferencia
// jerarquías por peso y tamaño, como la web con Geist.
extension Font {
    /// Título de la app en el inicio.
    static let tituloApp = Font.system(size: 44, weight: .heavy)
    /// Nombre del jugador o encabezado grande de pantalla.
    static let encabezado = Font.system(size: 34, weight: .heavy)
    /// Encabezado mediano (¿Quién es el impostor?, veredicto).
    static let encabezadoMedio = Font.system(size: 28, weight: .heavy)
    /// La palabra secreta en la carta.
    static let palabra = Font.system(size: 40, weight: .heavy)
    /// La pista lejana.
    static let pista = Font.system(size: 24, weight: .bold)
    /// Título de sección.
    static let seccion = Font.system(size: 18, weight: .bold)
    /// Etiqueta de botón principal.
    static let boton = Font.system(size: 18, weight: .semibold)
    /// Filas y botones secundarios.
    static let fila = Font.system(size: 17, weight: .semibold)
    /// Texto de apoyo.
    static let apoyo = Font.system(size: 14, weight: .regular)
    /// Etiquetas pequeñas en mayúsculas.
    static let etiqueta = Font.system(size: 12, weight: .semibold)
}

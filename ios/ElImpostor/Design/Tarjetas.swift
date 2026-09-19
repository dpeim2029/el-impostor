import SwiftUI

/// Panel redondeado con relleno translúcido y borde fino, base de tarjetas y filas.
struct TarjetaModifier: ViewModifier {
    var relleno: Color
    var borde: Color?
    var radio: CGFloat
    var grosor: CGFloat
    var discontinuo: Bool

    func body(content: Content) -> some View {
        content
            .background(relleno, in: .rect(cornerRadius: radio))
            .overlay {
                if let borde {
                    RoundedRectangle(cornerRadius: radio)
                        .strokeBorder(
                            borde,
                            style: StrokeStyle(lineWidth: grosor, dash: discontinuo ? [8, 6] : [])
                        )
                }
            }
    }
}

extension View {
    func tarjeta(
        relleno: Color = Color.tarjeta.opacity(0.7),
        borde: Color? = nil,
        radio: CGFloat = 20,
        grosor: CGFloat = 1,
        discontinuo: Bool = false
    ) -> some View {
        modifier(TarjetaModifier(relleno: relleno, borde: borde, radio: radio, grosor: grosor, discontinuo: discontinuo))
    }
}

/// Pastilla con borde: categoría de la palabra, estado del impostor.
struct Insignia: View {
    var texto: String
    var emoji: String? = nil
    var tinte: Color = .texto
    var relleno: Color? = nil

    var body: some View {
        HStack(spacing: 6) {
            if let emoji {
                Text(emoji)
            }
            Text(texto)
        }
        .font(.apoyo.weight(.semibold))
        .foregroundStyle(relleno == nil ? tinte : Color.texto)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(relleno ?? .clear, in: .capsule)
        .overlay {
            if relleno == nil {
                Capsule().strokeBorder(tinte.opacity(0.4), lineWidth: 1)
            }
        }
    }
}

/// Número dentro de un círculo, para listas ordenadas.
struct NumeroCirculo: View {
    var numero: Int
    var tamano: CGFloat = 28
    var relleno: Color = .secundario
    var color: Color = .texto

    var body: some View {
        Text("\(numero)")
            .font(.system(size: tamano * 0.45, weight: .bold))
            .foregroundStyle(color)
            .frame(width: tamano, height: tamano)
            .background(relleno, in: .circle)
    }
}

/// Etiqueta pequeña en mayúsculas para encabezar un bloque.
struct EtiquetaSeccion: View {
    var texto: LocalizedStringKey

    var body: some View {
        Text(texto)
            .font(.etiqueta)
            .textCase(.uppercase)
            .tracking(1)
            .foregroundStyle(Color.textoApagado)
    }
}

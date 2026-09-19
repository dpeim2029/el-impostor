import SwiftUI

/// Tarjeta grande de revelación (acusación y resultado): ícono, texto de apoyo y veredicto.
struct TarjetaRevelacion: View {
    var simbolo: String
    var tinte: Color
    var apoyo: LocalizedStringKey?
    var veredicto: LocalizedStringKey

    @State private var aparecio = false

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: simbolo)
                .font(.system(size: 64, weight: .semibold))
                .foregroundStyle(tinte)
                .symbolEffect(.bounce, value: aparecio)
            if let apoyo {
                Text(apoyo)
                    .font(.cuerpo)
                    .foregroundStyle(Color.textoApagado)
            }
            Text(veredicto)
                .font(.encabezado)
                .foregroundStyle(tinte)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 32)
        .padding(.horizontal, 24)
        .tarjeta(relleno: tinte.opacity(0.12), borde: tinte.opacity(0.6), radio: 28, grosor: 2)
        .scaleEffect(aparecio ? 1 : 0.92)
        .opacity(aparecio ? 1 : 0)
        .onAppear {
            withAnimation(.spring(duration: 0.4, bounce: 0.3)) { aparecio = true }
        }
    }
}

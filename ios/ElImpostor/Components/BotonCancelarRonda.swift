import SwiftUI

/// Botón de salida de la cabecera durante la ronda, con confirmación para no perderla por un toque accidental.
struct BotonCancelarRonda: View {
    @Environment(JuegoStore.self) private var store
    @State private var confirmando = false

    var body: some View {
        Button {
            confirmando = true
        } label: {
            Image(systemName: "xmark")
        }
        .buttonStyle(.icono)
        .accessibilityLabel("Cancelar ronda")
        .accessibilityIdentifier("cancelarRonda")
        .confirmationDialog("¿Cancelar la ronda?", isPresented: $confirmando, titleVisibility: .visible) {
            Button("Cancelar la ronda", role: .destructive) {
                store.enviar(.cancelarRonda)
            }
            Button("Seguir jugando", role: .cancel) {}
        }
    }
}

import SwiftUI

/// Fondo de toda la app: papel claro, plano, sin degradados.
struct FondoView: View {
    var body: some View {
        Color.papel
            .ignoresSafeArea()
    }
}

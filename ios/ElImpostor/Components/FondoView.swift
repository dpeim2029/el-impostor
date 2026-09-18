import SwiftUI

/// Fondo de toda la app: índigo profundo con dos resplandores suaves (morado arriba, rojo abajo a la derecha),
/// igual que el `body` de la versión web.
struct FondoView: View {
    var body: some View {
        GeometryReader { geo in
            ZStack {
                Color.fondo
                RadialGradient(
                    colors: [Color.glowMorado, .clear],
                    center: .init(x: 0.5, y: -0.1),
                    startRadius: 0,
                    endRadius: geo.size.width * 1.1
                )
                RadialGradient(
                    colors: [Color.glowRojo, .clear],
                    center: .init(x: 1.0, y: 1.0),
                    startRadius: 0,
                    endRadius: geo.size.width * 0.9
                )
            }
        }
        .ignoresSafeArea()
    }
}

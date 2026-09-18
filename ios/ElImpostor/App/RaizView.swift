import SwiftUI

struct RaizView: View {
    var body: some View {
        ZStack {
            FondoView()
            Text("El Impostor")
                .font(.system(size: 40, weight: .heavy))
                .foregroundStyle(Color.texto)
        }
    }
}

#Preview {
    RaizView()
        .preferredColorScheme(.dark)
        .fontDesign(.rounded)
}

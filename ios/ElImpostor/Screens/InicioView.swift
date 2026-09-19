import SwiftUI
import ImpostorCore

struct InicioView: View {
    @Environment(JuegoStore.self) private var store

    private var conPista: Binding<Bool> {
        Binding(
            get: { store.estado.ajustes.conPista },
            set: { store.enviar(.setConPista($0)) }
        )
    }

    var body: some View {
        Pantalla {
            Spacer(minLength: 24)

            VStack(spacing: 20) {
                LogoImpostor()
                    .frame(width: 72, height: 72)
                    .frame(width: 112, height: 112)
                    .background(Color.impostor.opacity(0.15), in: .rect(cornerRadius: 36))
                    .shadow(color: Color.impostor.opacity(0.5), radius: 40)
                Text("El Impostor")
                    .font(.tituloApp)
                    .tracking(-1)
                Text("Todos saben la palabra menos uno. Encuéntrenlo.")
                    .font(.cuerpo)
                    .foregroundStyle(Color.textoApagado)
                    .multilineTextAlignment(.center)
            }

            Spacer(minLength: 24)

            VStack(spacing: 12) {
                SelectorSegmentado(
                    opciones: [
                        .init(valor: true, etiqueta: "Con pistas"),
                        .init(valor: false, etiqueta: "Sin pistas"),
                    ],
                    seleccion: conPista,
                    etiquetaAccesible: "Modo de juego"
                )
                .accessibilityIdentifier("modoDeJuego")
                Text(conPista.wrappedValue ? "El impostor recibe una pista lejana." : "El impostor entra a ciegas.")
                    .font(.apoyo)
                    .foregroundStyle(Color.textoApagado)
                    .contentTransition(.opacity)
                    .animation(.snappy, value: conPista.wrappedValue)

                Button("Jugar") { store.enviar(.ir(.ajustes)) }
                    .buttonStyle(.primario)
                    .accessibilityIdentifier("jugar")
                    .padding(.top, 8)
                Button("Cómo se juega") { store.enviar(.ir(.comoJugar)) }
                    .buttonStyle(.secundario)
                    .accessibilityIdentifier("comoSeJuega")
            }

            Spacer(minLength: 16)
        }
    }
}

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

    /// "Cómo se juega" es una fase del motor, presentada aquí como hoja.
    private var mostrandoComoJugar: Binding<Bool> {
        Binding(
            get: { store.estado.fase == .comoJugar },
            set: { if !$0 { store.enviar(.ir(.inicio)) } }
        )
    }

    var body: some View {
        Pantalla(desplazable: false) {
            Spacer(minLength: 24)

            VStack(alignment: .leading, spacing: 14) {
                // Dos líneas con el interlineado apretado de un cartel.
                VStack(alignment: .leading, spacing: -8) {
                    Text("El")
                    Text("Impostor")
                        .marcador(.amarillo)
                }
                .font(.tituloApp)
                .textCase(.uppercase)
                .tracking(-2)
                .foregroundStyle(Color.tinta)
                .accessibilityElement(children: .combine)
                .accessibilityLabel("El Impostor")
                Text("Todos saben la palabra menos uno. Encuéntrenlo.")
                    .font(.cuerpo)
                    .foregroundStyle(Color.textoSecundario)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

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
                    .foregroundStyle(Color.textoSecundario)
                    .contentTransition(.opacity)
                    .animation(.snappy, value: conPista.wrappedValue)

                Button("Jugar") { store.enviar(.ir(.ajustes)) }
                    .buttonStyle(.primario)
                    .accessibilityIdentifier("jugar")
                    .padding(.top, 6)
                Button("Cómo se juega") { store.enviar(.ir(.comoJugar)) }
                    .buttonStyle(.secundario)
                    .accessibilityIdentifier("comoSeJuega")
            }

            Spacer(minLength: 8)
        } pie: {
            Link(destination: URL(string: "https://x.com/danielpeimbert")!) {
                Text("Hecho por **@danielpeimbert**")
                    .font(.apoyo)
                    .foregroundStyle(Color.textoSecundario)
                    .frame(minHeight: 44)
            }
            .accessibilityLabel("Hecho por Daniel Peimbert. Abre su perfil en X.")
            .accessibilityIdentifier("credito")
        }
        .sheet(isPresented: mostrandoComoJugar) {
            ComoJugarView()
                .presentationDetents([.height(560), .large])
                .presentationDragIndicator(.visible)
                .presentationCornerRadius(34)
                .presentationBackground(Color.tarjeta)
        }
    }
}

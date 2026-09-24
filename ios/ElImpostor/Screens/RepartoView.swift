import SwiftUI
import ImpostorCore

struct RepartoView: View {
    @Environment(JuegoStore.self) private var store

    var body: some View {
        let estado = store.estado
        if let ronda = estado.ronda, estado.jugadores.indices.contains(estado.indiceReparto) {
            let jugador = estado.jugadores[estado.indiceReparto]
            RepartoJugadorView(
                nombre: jugador.nombre,
                posicion: estado.indiceReparto + 1,
                total: estado.jugadores.count,
                palabra: ronda.palabra,
                rol: ronda.roles[jugador.id] ?? .civil,
                conPista: estado.ajustes.conPista,
                alSiguiente: { store.enviar(.siguienteCarta) }
            )
            .id(jugador.id)  // reinicia el estado local (carta vista) por jugador
        }
    }
}

private struct RepartoJugadorView: View {
    var nombre: String
    var posicion: Int
    var total: Int
    var palabra: Palabra
    var rol: Rol
    var conPista: Bool
    var alSiguiente: () -> Void

    @State private var vista = false
    @State private var visible = false

    var body: some View {
        Pantalla(titulo: "\(posicion) de \(total)", desplazable: false) {
            VStack(spacing: 8) {
                EtiquetaSeccion(texto: "Pasa el teléfono a")
                Text(nombre)
                    .font(.nombre)
                    .textCase(.uppercase)
                    .foregroundStyle(Color.tinta)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .minimumScaleFactor(0.6)
                    .accessibilityIdentifier("nombreEnTurno")
            }
            .padding(.top, 6)
            // Mientras la carta está abierta, lo demás se difumina para concentrar la mirada.
            .blur(radius: visible ? 9 : 0)
            .opacity(visible ? 0.55 : 1)
            .animation(.easeOut(duration: 0.25), value: visible)

            Spacer(minLength: 0)

            CartaJugadorView(nombre: nombre, rol: rol, palabra: palabra, conPista: conPista, visible: $visible) {
                vista = true
            }

            Spacer(minLength: 0)
        } accion: {
            BotonCancelarRonda()
        } pie: {
            Button {
                alSiguiente()
            } label: {
                HStack(spacing: 8) {
                    Text(posicion == total ? "Jugar" : "Pasar el teléfono")
                    Image(systemName: "arrow.right")
                }
            }
            .buttonStyle(.primario)
            .disabled(!vista)
            .accessibilityIdentifier("pasarTelefono")
        }
    }
}

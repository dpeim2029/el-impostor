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

    var body: some View {
        Pantalla(titulo: "\(posicion) de \(total)", desplazable: false) {
            VStack(spacing: 4) {
                Text("Pásale el teléfono a")
                    .font(.apoyo)
                    .foregroundStyle(Color.textoApagado)
                Text(nombre)
                    .font(.encabezado)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .minimumScaleFactor(0.7)
                    .accessibilityIdentifier("nombreEnTurno")
            }
            .padding(.top, 8)

            Spacer(minLength: 0)

            CartaJugadorView(rol: rol, palabra: palabra, conPista: conPista) {
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

import SwiftUI
import ImpostorCore

struct RondaView: View {
    @Environment(JuegoStore.self) private var store

    var body: some View {
        if let ronda = store.estado.ronda {
            let orden = ronda.orden.compactMap(store.jugador)
            Pantalla(titulo: ronda.vuelta == 1 ? "Ronda" : "Vuelta \(ronda.vuelta)") {
                VStack(spacing: 4) {
                    Text("Empieza")
                        .font(.apoyo)
                        .foregroundStyle(Color.textoApagado)
                    Text(orden.first?.nombre ?? "")
                        .font(.encabezado)
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.7)
                        .accessibilityIdentifier("empieza")
                    Text("Una palabra cada quien, en este orden.")
                        .font(.apoyo)
                        .foregroundStyle(Color.textoApagado)
                        .padding(.top, 4)
                }
                .padding(.top, 8)

                VStack(spacing: 8) {
                    ForEach(Array(orden.enumerated()), id: \.element.id) { indice, jugador in
                        HStack(spacing: 12) {
                            NumeroCirculo(numero: indice + 1)
                            Text(jugador.nombre)
                                .font(.cuerpo.weight(.medium))
                                .lineLimit(1)
                            Spacer(minLength: 0)
                        }
                        .padding(.horizontal, 16)
                        .frame(minHeight: 52)
                        .tarjeta(
                            relleno: indice == 0 ? Color.ambar.opacity(0.15) : Color.tarjeta.opacity(0.7),
                            borde: indice == 0 ? Color.ambar.opacity(0.5) : nil,
                            radio: 16
                        )
                    }
                }
            } accion: {
                BotonCancelarRonda()
            } pie: {
                Button("Votar") { store.enviar(.irAVotar) }
                    .buttonStyle(.primario)
                    .accessibilityIdentifier("votar")
                Button {
                    store.enviar(.otraVuelta)
                } label: {
                    Label("Otra vuelta", systemImage: "arrow.counterclockwise")
                }
                .buttonStyle(.secundario)
                .accessibilityIdentifier("otraVuelta")
            }
        }
    }
}

import SwiftUI
import ImpostorCore

struct RondaView: View {
    @Environment(JuegoStore.self) private var store

    var body: some View {
        if let ronda = store.estado.ronda {
            let orden = ronda.orden.compactMap(store.jugador)
            Pantalla(titulo: ronda.vuelta == 1 ? "Ronda" : "Vuelta \(ronda.vuelta)") {
                VStack(spacing: 8) {
                    EtiquetaSeccion(texto: "Empieza")
                    Text(orden.first?.nombre ?? "")
                        .font(.nombre)
                        .textCase(.uppercase)
                        .foregroundStyle(Color.tinta)
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.6)
                        .marcador(.amarillo)
                        .padding(.vertical, 4)
                        .accessibilityIdentifier("empieza")
                    Text("Una palabra cada uno, en este orden.")
                        .font(.apoyo)
                        .foregroundStyle(Color.textoSecundario)
                        .padding(.top, 2)
                }
                .padding(.top, 6)

                MarcoDeColor(color: .cielo) {
                  GrupoBlanco(radio: 16) {
                    ForEach(Array(orden.enumerated()), id: \.element.id) { indice, jugador in
                        if indice > 0 { Separador() }
                        HStack(spacing: 12) {
                            NumeroCirculo(
                                numero: indice + 1,
                                tamano: 26,
                                relleno: indice == 0 ? .tinta : .cielo,
                                color: indice == 0 ? .white : .tinta
                            )
                            Text(jugador.nombre)
                                .font(indice == 0 ? .fila : .cuerpo)
                                .foregroundStyle(Color.tinta)
                                .lineLimit(1)
                            Spacer(minLength: 0)
                        }
                        .padding(.horizontal, 16)
                        .frame(minHeight: 52)
                        .background(indice == 0 ? Color.amarillo : Color.clear)
                    }
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

import SwiftUI
import ImpostorCore

struct VotacionView: View {
    @Environment(JuegoStore.self) private var store
    @State private var pendiente: Jugador?
    @State private var revelando = false

    var body: some View {
        if let ronda = store.estado.ronda {
            let permitidas = acusacionesPermitidas(ronda)
            let hechas = ronda.acusaciones.count
            let faltan = permitidas - hechas
            let ultimo = ronda.acusaciones.last.flatMap(store.jugador)

            if revelando, let ultimo {
                revelacion(ultimo, ronda: ronda, hechas: hechas, permitidas: permitidas, faltan: faltan)
            } else {
                lista(ronda, hechas: hechas, permitidas: permitidas)
            }
        }
    }

    private func revelacion(_ jugador: Jugador, ronda: Ronda, hechas: Int, permitidas: Int, faltan: Int) -> some View {
        let eraImpostor = ronda.roles[jugador.id] == .impostor
        return Pantalla(titulo: permitidas > 1 ? "\(hechas) de \(permitidas)" : "Votación") {
            Spacer(minLength: 0)
            TarjetaRevelacion(
                simbolo: eraImpostor ? "theatermasks.fill" : "checkmark.seal.fill",
                tinte: eraImpostor ? .impostor : .civil,
                apoyo: "\(jugador.nombre) era…",
                veredicto: eraImpostor ? "¡Impostor!" : "Civil"
            )
            .sensoryFeedback(eraImpostor ? .error : .success, trigger: revelando)
            .accessibilityIdentifier("revelacion")
            Spacer(minLength: 0)
        } pie: {
            Button {
                if faltan > 0 {
                    revelando = false
                } else {
                    store.enviar(.verResultado)
                }
            } label: {
                HStack(spacing: 8) {
                    Text(faltan > 0 ? "Siguiente" : "Resultado")
                    Image(systemName: "arrow.right")
                }
            }
            .buttonStyle(.primario)
            .accessibilityIdentifier("siguiente")
        }
    }

    private func lista(_ ronda: Ronda, hechas: Int, permitidas: Int) -> some View {
        Pantalla(titulo: permitidas > 1 ? "Acusación \(hechas + 1) de \(permitidas)" : "Votación") {
            Text("¿Quién es el impostor?")
                .font(.encabezadoMedio)
                .multilineTextAlignment(.center)
                .padding(.top, 8)

            VStack(spacing: 8) {
                ForEach(store.estado.jugadores) { jugador in
                    let acusado = ronda.acusaciones.contains(jugador.id)
                    let eraImpostor = ronda.roles[jugador.id] == .impostor
                    let tinte: Color? = acusado ? (eraImpostor ? .impostor : .civil) : nil
                    Button {
                        pendiente = jugador
                    } label: {
                        HStack {
                            Text(jugador.nombre)
                                .lineLimit(1)
                                .foregroundStyle(tinte ?? .texto)
                            Spacer()
                            if acusado {
                                Text(eraImpostor ? "Impostor" : "Civil")
                                    .font(.apoyo.weight(.medium))
                                    .foregroundStyle(tinte ?? .texto)
                            }
                        }
                    }
                    .buttonStyle(FilaButtonStyle(tinte: tinte))
                    .disabled(acusado)
                    .accessibilityIdentifier("acusar-\(jugador.nombre)")
                }
            }
        } accion: {
            BotonCancelarRonda()
        }
        .confirmationDialog(
            "¿Acusar a \(pendiente?.nombre ?? "")?",
            isPresented: Binding(get: { pendiente != nil }, set: { if !$0 { pendiente = nil } }),
            titleVisibility: .visible,
            presenting: pendiente
        ) { jugador in
            Button("Acusar") {
                store.enviar(.acusar(id: jugador.id))
                pendiente = nil
                revelando = true
            }
            Button("No", role: .cancel) { pendiente = nil }
        }
    }
}

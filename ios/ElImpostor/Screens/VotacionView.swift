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
                ModalSobreFondo {
                    lista(ronda, hechas: hechas, permitidas: permitidas, interactiva: false)
                } tarjeta: {
                    revelacion(ultimo, ronda: ronda, faltan: faltan)
                }
                .transition(.opacity)
            } else {
                lista(ronda, hechas: hechas, permitidas: permitidas, interactiva: true)
                    .confirmationDialog(
                        "¿Acusar a \(pendiente?.nombre ?? "")?",
                        isPresented: Binding(get: { pendiente != nil }, set: { if !$0 { pendiente = nil } }),
                        titleVisibility: .visible,
                        presenting: pendiente
                    ) { jugador in
                        Button("Acusar") {
                            store.enviar(.acusar(id: jugador.id))
                            pendiente = nil
                            withAnimation(.snappy(duration: 0.25)) { revelando = true }
                        }
                        Button("No", role: .cancel) { pendiente = nil }
                    }
            }
        }
    }

    private func revelacion(_ jugador: Jugador, ronda: Ronda, faltan: Int) -> some View {
        let eraImpostor = ronda.roles[jugador.id] == .impostor
        return TarjetaModal(
            titulo: eraImpostor ? "¡Impostor!" : "Civil",
            subtitulo: eraImpostor ? "\(jugador.nombre) era el impostor." : "\(jugador.nombre) era civil."
        ) {
            TileIcono(color: eraImpostor ? .rojo : .verde) {
                if eraImpostor {
                    LogoImpostor(color: .white).frame(width: 52, height: 52)
                } else {
                    Image(systemName: "checkmark")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundStyle(.white)
                }
            }
        } botones: {
            Button(faltan > 0 ? "Siguiente" : "Ver resultado") {
                if faltan > 0 {
                    withAnimation(.snappy(duration: 0.25)) { revelando = false }
                } else {
                    store.enviar(.verResultado)
                }
            }
            .buttonStyle(.primario)
            .accessibilityIdentifier("siguiente")
        }
        .sensoryFeedback(eraImpostor ? .error : .success, trigger: revelando)
        .accessibilityIdentifier("revelacion")
    }

    private func lista(_ ronda: Ronda, hechas: Int, permitidas: Int, interactiva: Bool) -> some View {
        Pantalla(titulo: permitidas > 1 ? "Acusación \(hechas + 1) de \(permitidas)" : "Votación") {
            Text("¿Quién es el impostor?")
                .font(.encabezadoMedio)
                .foregroundStyle(Color.tinta)
                .multilineTextAlignment(.center)
                .padding(.top, 6)

            GrupoBlanco {
                ForEach(Array(store.estado.jugadores.enumerated()), id: \.element.id) { indice, jugador in
                    if indice > 0 { Separador() }
                    let acusado = ronda.acusaciones.contains(jugador.id)
                    let eraImpostor = ronda.roles[jugador.id] == .impostor
                    let tinte: Color = eraImpostor ? .rojo : .verde
                    Button {
                        pendiente = jugador
                    } label: {
                        HStack {
                            Text(jugador.nombre)
                                .font(.fila)
                                .foregroundStyle(acusado ? tinte : Color.tinta)
                                .lineLimit(1)
                            Spacer()
                            if acusado {
                                Text(eraImpostor ? "Impostor" : "Civil")
                                    .font(.apoyo.weight(.semibold))
                                    .foregroundStyle(tinte)
                            } else {
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundStyle(Color.textoTerciario)
                            }
                        }
                        .padding(.horizontal, 16)
                        .frame(minHeight: 56)
                        .contentShape(.rect)
                    }
                    .buttonStyle(.plain)
                    .disabled(acusado || !interactiva)
                    .accessibilityIdentifier("acusar-\(jugador.nombre)")
                }
            }
        } accion: {
            BotonCancelarRonda()
        }
    }
}

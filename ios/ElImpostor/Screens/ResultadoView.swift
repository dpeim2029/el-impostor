import SwiftUI
import ImpostorCore

struct ResultadoView: View {
    @Environment(JuegoStore.self) private var store

    var body: some View {
        if let ronda = store.estado.ronda {
            let resultado = resolverVoto(ronda)
            // Impostores en orden de asiento, que es como la gente los ve en la mesa.
            let impostores = store.estado.jugadores.map(\.id).filter { ronda.roles[$0] == .impostor }
            let plural = impostores.count > 1
            let ganaron = resultado.ganaronCiviles

            ModalSobreFondo {
                fondo
            } tarjeta: {
                TarjetaModal(
                    titulo: veredicto(ganaron: ganaron, plural: plural),
                    subtitulo: ganaron ? "Los civiles ganan esta ronda." : (plural ? "Los impostores ganan esta ronda." : "El impostor gana esta ronda."),
                    marcador: ganaron ? .menta : .coral
                ) {
                    TileIcono(color: ganaron ? .verde : .rojo) {
                        if ganaron {
                            Image(systemName: "checkmark")
                                .font(.system(size: 40, weight: .bold))
                                .foregroundStyle(.white)
                        } else {
                            LogoImpostor(color: .white).frame(width: 52, height: 52)
                        }
                    }
                } detalle: {
                    VStack(spacing: 0) {
                        FilaDetalle(etiqueta: "Palabra") {
                            Text("\(ronda.palabra.texto) \(ronda.palabra.categoriaEmoji)")
                                .font(.fila)
                                .foregroundStyle(Color.tinta)
                        }
                        if store.estado.ajustes.conPista {
                            Rectangle().fill(Color.separador).frame(height: 1)
                            FilaDetalle(etiqueta: "Pista") {
                                Text(ronda.palabra.pista)
                                    .font(.fila)
                                    .foregroundStyle(Color.tinta)
                            }
                        }
                        ForEach(impostores, id: \.self) { id in
                            let atrapado = resultado.atrapados.contains(id)
                            Rectangle().fill(Color.separador).frame(height: 1)
                            FilaDetalle(etiqueta: "Impostor") {
                                Text(store.nombre(id))
                                    .font(.fila)
                                    .foregroundStyle(Color.tinta)
                                    .lineLimit(1)
                                PastillaEstado(
                                    texto: atrapado ? "Atrapado" : "Se escapó",
                                    relleno: atrapado ? .verdeSuave : .rojoSuave,
                                    color: atrapado ? .verdeTexto : .rojoTexto
                                )
                            }
                        }
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 2)
                    .background(Color.tarjeta, in: .rect(cornerRadius: 12))
                    .padding(8)
                    .background(Color.amarillo, in: .rect(cornerRadius: 18))
                    .padding(.top, 8)
                } botones: {
                    Button("Otra ronda") { store.enviar(.otraRonda) }
                        .buttonStyle(.primario)
                        .accessibilityIdentifier("otraRonda")
                    Button("Ajustes") { store.enviar(.cancelarRonda) }
                        .buttonStyle(.borde)
                        .accessibilityIdentifier("jugadoresYAjustes")
                }
                .sensoryFeedback(ganaron ? .success : .warning, trigger: ronda.acusaciones)
                .accessibilityIdentifier("veredicto")
            }
        }
    }

    /// La lista de jugadores, difuminada detrás de la tarjeta.
    private var fondo: some View {
        Pantalla {
            GrupoBlanco {
                ForEach(Array(store.estado.jugadores.enumerated()), id: \.element.id) { indice, jugador in
                    if indice > 0 { Separador() }
                    HStack {
                        Text(jugador.nombre).font(.fila)
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .frame(minHeight: 56)
                }
            }
            .padding(.top, 60)
        }
    }

    private func veredicto(ganaron: Bool, plural: Bool) -> LocalizedStringKey {
        switch (ganaron, plural) {
        case (true, false): "¡Lo atraparon!"
        case (true, true): "¡Los atraparon!"
        case (false, false): "¡Se escapó!"
        case (false, true): "¡Se escaparon!"
        }
    }
}

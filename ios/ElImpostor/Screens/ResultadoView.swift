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

            Pantalla(titulo: "Resultado") {
                TarjetaRevelacion(
                    simbolo: ganaron ? "party.popper.fill" : "theatermasks.fill",
                    tinte: ganaron ? .civil : .impostor,
                    veredicto: veredicto(ganaron: ganaron, plural: plural)
                )
                .sensoryFeedback(ganaron ? .success : .warning, trigger: ronda.acusaciones)
                .accessibilityIdentifier("veredicto")

                VStack(alignment: .leading, spacing: 8) {
                    EtiquetaSeccion(texto: "Palabra")
                    HStack(spacing: 10) {
                        Text(ronda.palabra.texto)
                            .font(.encabezadoMedio)
                            .minimumScaleFactor(0.7)
                        Insignia(texto: ronda.palabra.categoriaNombre, emoji: ronda.palabra.categoriaEmoji, tinte: .textoApagado)
                    }
                    if store.estado.ajustes.conPista {
                        Text("Pista: **\(ronda.palabra.pista)**")
                            .font(.apoyo)
                            .foregroundStyle(Color.textoApagado)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .tarjeta()

                VStack(alignment: .leading, spacing: 10) {
                    EtiquetaSeccion(texto: plural ? "Impostores" : "Impostor")
                    ForEach(impostores, id: \.self) { id in
                        let atrapado = resultado.atrapados.contains(id)
                        HStack(spacing: 8) {
                            Image(systemName: "theatermasks.fill")
                                .foregroundStyle(Color.impostor)
                            Text(store.nombre(id))
                                .font(.fila)
                                .lineLimit(1)
                            Spacer()
                            Insignia(
                                texto: atrapado ? "Atrapado" : "Se escapó",
                                relleno: atrapado ? .civil : .impostor
                            )
                            .foregroundStyle(atrapado ? Color.civilTexto : Color.impostorTexto)
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .tarjeta()
            } pie: {
                Button("Otra ronda") { store.enviar(.otraRonda) }
                    .buttonStyle(.primario)
                    .accessibilityIdentifier("otraRonda")
                Button("Jugadores y ajustes") { store.enviar(.cancelarRonda) }
                    .buttonStyle(.secundario)
                    .accessibilityIdentifier("jugadoresYAjustes")
            }
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

import SwiftUI
import ImpostorCore

/// Contenido de la hoja "Cómo se juega".
struct ComoJugarView: View {
    @Environment(JuegoStore.self) private var store

    private let pasos: [LocalizedStringKey] = [
        "Pásense el teléfono. Cada uno ve su carta en secreto.",
        "Todos ven la misma palabra, menos el impostor.",
        "Por turnos, cada uno dice una palabra relacionada.",
        "El impostor debe fingir. Con pistas, solo sabe una pista lejana.",
        "Acusen a alguien. Si es el impostor, ganan.",
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Text("Cómo se juega")
                    .font(.hojaTitulo)
                    .foregroundStyle(Color.tinta)
                    .padding(.top, 22)
                    .padding(.bottom, 6)

                ForEach(Array(pasos.enumerated()), id: \.offset) { indice, paso in
                    if indice > 0 {
                        Rectangle().fill(Color.rellenoClaro).frame(height: 1)
                    }
                    HStack(alignment: .top, spacing: 12) {
                        Calcomania(numero: indice + 1, color: Color.stickers[indice % Color.stickers.count])
                        Text(paso)
                            .font(.cuerpo)
                            .foregroundStyle(Color.tinta)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .padding(.vertical, 12)
                }

                Text("Ejemplo: la palabra es **Pizza**; el impostor solo ve **Italia**.")
                    .font(.apoyo)
                    .foregroundStyle(Color.textoSecundario)
                    .padding(.top, 8)

                Button("Jugar") { store.enviar(.ir(.ajustes)) }
                    .buttonStyle(.primario)
                    .accessibilityIdentifier("jugar")
                    .padding(.top, 20)
            }
            .padding(.horizontal, 22)
            .padding(.bottom, 24)
        }
        .scrollBounceBehavior(.basedOnSize)
    }
}

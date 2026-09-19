import SwiftUI
import ImpostorCore

struct ComoJugarView: View {
    @Environment(JuegoStore.self) private var store

    private let pasos: [LocalizedStringKey] = [
        "Pásense el teléfono. Cada quien ve su carta en secreto.",
        "Todos ven la misma palabra, menos el impostor.",
        "Por turnos, cada quien dice una palabra relacionada.",
        "El impostor debe fingir. Con pistas, solo sabe una pista lejana.",
        "Acusen a alguien. Si es el impostor, ganan.",
    ]

    var body: some View {
        Pantalla(titulo: "Cómo se juega", alRegresar: { store.enviar(.ir(.inicio)) }) {
            VStack(spacing: 8) {
                ForEach(Array(pasos.enumerated()), id: \.offset) { indice, paso in
                    HStack(spacing: 12) {
                        NumeroCirculo(numero: indice + 1, tamano: 32, relleno: .ambar, color: .ambarTexto)
                        Text(paso)
                            .font(.cuerpo)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .padding(16)
                    .tarjeta()
                }
            }
            .padding(.top, 8)

            Text("Ejemplo: la palabra es **Pizza**; el impostor solo ve **Italia**.")
                .font(.apoyo)
                .foregroundStyle(Color.textoApagado)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 4)
        } pie: {
            Button("Jugar") { store.enviar(.ir(.ajustes)) }
                .buttonStyle(.primario)
                .accessibilityIdentifier("jugar")
        }
    }
}

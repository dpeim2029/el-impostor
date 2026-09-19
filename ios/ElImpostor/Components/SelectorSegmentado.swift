import SwiftUI

/// Control segmentado de 48 pt con la pastilla blanca que se desliza; el nativo mide 32 pt y es chico para un juego.
struct SelectorSegmentado<Valor: Hashable>: View {
    struct Opcion: Identifiable {
        var valor: Valor
        var etiqueta: LocalizedStringKey
        var deshabilitada = false
        var id: Valor { valor }
    }

    var opciones: [Opcion]
    @Binding var seleccion: Valor
    var etiquetaAccesible: LocalizedStringKey

    @Namespace private var espacio

    var body: some View {
        HStack(spacing: 4) {
            ForEach(opciones) { opcion in
                let activa = opcion.valor == seleccion
                Button {
                    guard !opcion.deshabilitada else { return }
                    withAnimation(.snappy(duration: 0.25)) {
                        seleccion = opcion.valor
                    }
                } label: {
                    Text(opcion.etiqueta)
                        .font(.fila)
                        .foregroundStyle(activa ? Color.tinta : Color.textoSecundario)
                        .frame(maxWidth: .infinity)
                        .frame(height: 40)
                        .background {
                            if activa {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.tarjeta)
                                    .shadow(color: .black.opacity(0.14), radius: 3, y: 1)
                                    .matchedGeometryEffect(id: "pastilla", in: espacio)
                            }
                        }
                        .contentShape(.rect)
                }
                .buttonStyle(.plain)
                .disabled(opcion.deshabilitada)
                .opacity(opcion.deshabilitada ? 0.4 : 1)
                .accessibilityAddTraits(activa ? [.isSelected] : [])
            }
        }
        .padding(4)
        .background(Color.relleno, in: .rect(cornerRadius: 16))
        .sensoryFeedback(.selection, trigger: seleccion)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(etiquetaAccesible)
    }
}

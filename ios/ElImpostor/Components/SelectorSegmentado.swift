import SwiftUI

/// Control segmentado de 44 pt con la pastilla que se desliza; el nativo mide 32 pt y es chico para un juego.
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
                        .foregroundStyle(activa ? Color.texto : Color.textoApagado)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background {
                            if activa {
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(Color.secundario)
                                    .shadow(color: .black.opacity(0.25), radius: 4, y: 1)
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
        .background(Color.tarjeta.opacity(0.7), in: .rect(cornerRadius: 18))
        .sensoryFeedback(.selection, trigger: seleccion)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(etiquetaAccesible)
    }
}

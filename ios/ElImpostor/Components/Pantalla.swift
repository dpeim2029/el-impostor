import SwiftUI

/// Marco común de todas las pantallas: cabecera opcional (regresar, título, acción), contenido y
/// pie flotante con las acciones principales.
struct Pantalla<Contenido: View, Accion: View, Pie: View>: View {
    var titulo: LocalizedStringKey?
    var alRegresar: (() -> Void)?
    /// Con `false` el contenido no hace scroll (Reparto: el gesto de la carta no debe competir).
    var desplazable: Bool = true
    @ViewBuilder var contenido: () -> Contenido
    @ViewBuilder var accion: () -> Accion
    @ViewBuilder var pie: () -> Pie

    init(
        titulo: LocalizedStringKey? = nil,
        alRegresar: (() -> Void)? = nil,
        desplazable: Bool = true,
        @ViewBuilder contenido: @escaping () -> Contenido,
        @ViewBuilder accion: @escaping () -> Accion = { EmptyView() },
        @ViewBuilder pie: @escaping () -> Pie = { EmptyView() }
    ) {
        self.titulo = titulo
        self.alRegresar = alRegresar
        self.desplazable = desplazable
        self.contenido = contenido
        self.accion = accion
        self.pie = pie
    }

    private var hayCabecera: Bool {
        titulo != nil || alRegresar != nil || Accion.self != EmptyView.self
    }

    var body: some View {
        VStack(spacing: 0) {
            if hayCabecera {
                cabecera
            }
            if desplazable {
                ScrollView {
                    cuerpo
                }
                .scrollBounceBehavior(.basedOnSize)
            } else {
                cuerpo
            }
        }
        .frame(maxWidth: 448)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .safeAreaBar(edge: .bottom) {
            GlassEffectContainer(spacing: 8) {
                VStack(spacing: 8) {
                    pie()
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .frame(maxWidth: 448)
        }
    }

    private var cabecera: some View {
        HStack(spacing: 8) {
            if let alRegresar {
                Button(action: alRegresar) {
                    Image(systemName: "chevron.left")
                }
                .buttonStyle(.icono)
                .accessibilityLabel("Regresar")
                .accessibilityIdentifier("regresar")
            } else {
                Color.clear.frame(width: 40, height: 40)
            }
            Text(titulo ?? "")
                .font(.system(size: 17, weight: .semibold))
                .lineLimit(1)
                .frame(maxWidth: .infinity)
            accion()
                .frame(width: 40, height: 40, alignment: .trailing)
        }
        .frame(height: 56)
        .padding(.horizontal, 12)
    }

    private var cuerpo: some View {
        VStack(spacing: 16) {
            contenido()
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 16)
        .padding(.bottom, 16)
    }
}

import SwiftUI

/// Marco común de las pantallas de juego: cabecera opcional (regresar, título, acción), contenido y
/// pie con las acciones principales.
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
            if Pie.self != EmptyView.self {
                VStack(spacing: 10) {
                    pie()
                }
                .padding(.horizontal, 22)
                .padding(.top, 10)
                .padding(.bottom, 6)
                .frame(maxWidth: 448)
                .frame(maxWidth: .infinity)
                .background(Color.papel)
            }
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
                Color.clear.frame(width: 38, height: 38)
            }
            Group {
                if let titulo {
                    PastillaTitulo(texto: titulo)
                } else {
                    Color.clear
                }
            }
            .frame(maxWidth: .infinity)
            accion()
                .frame(width: 38, height: 38, alignment: .trailing)
        }
        .frame(height: 56)
        .padding(.horizontal, 16)
    }

    private var cuerpo: some View {
        VStack(spacing: 16) {
            contenido()
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 22)
        .padding(.bottom, 16)
    }
}

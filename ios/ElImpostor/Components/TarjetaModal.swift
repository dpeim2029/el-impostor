import SwiftUI

/// Tarjeta modal al estilo de iOS: ícono en un cuadro de color, título, subtítulo, detalle opcional y
/// botones. Aparece con un rebote suave.
struct TarjetaModal<Icono: View, Detalle: View, Botones: View>: View {
    var titulo: LocalizedStringKey
    var subtitulo: LocalizedStringKey?
    @ViewBuilder var icono: () -> Icono
    @ViewBuilder var detalle: () -> Detalle
    @ViewBuilder var botones: () -> Botones

    @State private var aparecio = false

    init(
        titulo: LocalizedStringKey,
        subtitulo: LocalizedStringKey? = nil,
        @ViewBuilder icono: @escaping () -> Icono,
        @ViewBuilder detalle: @escaping () -> Detalle = { EmptyView() },
        @ViewBuilder botones: @escaping () -> Botones
    ) {
        self.titulo = titulo
        self.subtitulo = subtitulo
        self.icono = icono
        self.detalle = detalle
        self.botones = botones
    }

    var body: some View {
        VStack(spacing: 10) {
            icono()
                .padding(.bottom, 6)
            Text(titulo)
                .font(.modalTitulo)
                .foregroundStyle(Color.tinta)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.8)
            if let subtitulo {
                Text(subtitulo)
                    .font(.cuerpo)
                    .foregroundStyle(Color.textoSecundario)
                    .multilineTextAlignment(.center)
            }
            detalle()
            HStack(spacing: 10) {
                botones()
            }
            .padding(.top, 12)
        }
        .padding(.horizontal, 22)
        .padding(.top, 30)
        .padding(.bottom, 22)
        .frame(maxWidth: .infinity)
        .tarjetaBlanca(radio: 30, elevada: true)
        // Contenedor de accesibilidad: un identificador puesto a la tarjeta no se hereda a sus botones.
        .accessibilityElement(children: .contain)
        .scaleEffect(aparecio ? 1 : 0.92)
        .opacity(aparecio ? 1 : 0)
        .onAppear {
            withAnimation(.spring(duration: 0.4, bounce: 0.3)) { aparecio = true }
        }
    }
}

/// Coloca una tarjeta modal sobre un fondo difuminado, como las alertas de iOS.
struct ModalSobreFondo<Fondo: View, Tarjeta: View>: View {
    @ViewBuilder var fondo: () -> Fondo
    @ViewBuilder var tarjeta: () -> Tarjeta

    var body: some View {
        ZStack {
            fondo()
                .blur(radius: 9)
                .opacity(0.55)
                .allowsHitTesting(false)
                .accessibilityHidden(true)
            Color.papel.opacity(0.35)
                .ignoresSafeArea()
            tarjeta()
                .padding(.horizontal, 20)
                .frame(maxWidth: 448)
        }
    }
}

/// Fila de detalle dentro de una tarjeta modal (etiqueta a la izquierda, valor a la derecha).
struct FilaDetalle<Valor: View>: View {
    var etiqueta: LocalizedStringKey
    @ViewBuilder var valor: () -> Valor

    var body: some View {
        HStack(spacing: 8) {
            Text(etiqueta)
                .font(.apoyo)
                .foregroundStyle(Color.textoSecundario)
            Spacer(minLength: 8)
            valor()
        }
        .frame(minHeight: 44)
    }
}

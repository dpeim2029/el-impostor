import SwiftUI
import ImpostorCore

/// La carta secreta. El contenido va arriba y la zona para el dedo abajo, así la mano nunca tapa el
/// texto. Se muestra solo mientras el jugador mantiene presionada la zona y se oculta al soltar,
/// al cambiar de app o al recibir una llamada.
struct CartaJugadorView: View {
    var rol: Rol
    var palabra: Palabra
    var conPista: Bool
    var alVer: () -> Void

    @State private var visible = false
    @Environment(\.scenePhase) private var scenePhase

    private var tinte: Color { rol == .impostor ? .impostor : .civil }

    var body: some View {
        VStack(spacing: 12) {
            panel
            zonaDelDedo
        }
        .onChange(of: scenePhase) { _, nueva in
            if nueva != .active { visible = false }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.willResignActiveNotification)) { _ in
            visible = false
        }
        .sensoryFeedback(.impact(weight: .medium), trigger: visible) { _, nueva in nueva }
        .onAppear {
            if ArgumentosDeDepuracion.mostrarCarta { mostrar() }
        }
    }

    private var panel: some View {
        ZStack {
            if visible {
                contenido
                    .transition(.scale(scale: 0.94).combined(with: .opacity))
            } else {
                Image(systemName: "lock.fill")
                    .font(.system(size: 36, weight: .semibold))
                    .foregroundStyle(Color.textoApagado)
                    .accessibilityLabel("Carta oculta")
                    .transition(.opacity)
            }
        }
        .frame(maxWidth: .infinity)
        .frame(minHeight: 256)
        .padding(24)
        .tarjeta(
            relleno: visible ? tinte.opacity(rol == .impostor ? 0.15 : 0.10) : Color.tarjeta.opacity(0.7),
            borde: visible ? tinte.opacity(0.6) : Color.borde,
            radio: 28,
            grosor: 2,
            discontinuo: !visible
        )
        .animation(.spring(duration: 0.3, bounce: 0.2), value: visible)
        .accessibilityIdentifier("cartaPanel")
    }

    @ViewBuilder
    private var contenido: some View {
        VStack(spacing: 16) {
            if rol == .impostor {
                Text("Eres el impostor")
                    .font(.palabra)
                    .foregroundStyle(Color.impostor)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.7)
                if conPista {
                    VStack(spacing: 2) {
                        EtiquetaSeccion(texto: "Pista")
                        Text(palabra.pista)
                            .font(.pista)
                            .foregroundStyle(Color.texto)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(Color.fondo.opacity(0.6), in: .rect(cornerRadius: 16))
                    Text("Escucha y no repitas la pista.")
                        .font(.apoyo)
                        .foregroundStyle(Color.textoApagado)
                } else {
                    Text("Escucha y finge que sabes la palabra.")
                        .font(.apoyo)
                        .foregroundStyle(Color.textoApagado)
                }
            } else {
                Insignia(texto: palabra.categoriaNombre, emoji: palabra.categoriaEmoji, tinte: .civil)
                Text(palabra.texto)
                    .font(.palabra)
                    .foregroundStyle(Color.texto)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.6)
            }
        }
        .accessibilityElement(children: .combine)
    }

    private var zonaDelDedo: some View {
        HStack(spacing: 12) {
            Image(systemName: "hand.tap.fill")
                .font(.system(size: 26, weight: .semibold))
            Text(visible ? "Suelta para ocultar" : "Mantén el dedo aquí")
                .font(.boton)
        }
        .foregroundStyle(visible ? Color.ambarTexto : Color.texto)
        .frame(maxWidth: .infinity)
        .frame(height: 96)
        .tarjeta(
            relleno: visible ? Color.ambar : Color.ambar.opacity(0.15),
            borde: visible ? Color.ambar : Color.ambar.opacity(0.5),
            radio: 28,
            grosor: 2
        )
        .contentShape(.rect(cornerRadius: 28))
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !visible { mostrar() }
                }
                .onEnded { _ in
                    visible = false
                }
        )
        .animation(.snappy(duration: 0.15), value: visible)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(visible ? "Suelta para ocultar" : "Mantén el dedo aquí")
        .accessibilityAddTraits(.isButton)
        .accessibilityAction {
            // Con VoiceOver o Switch Control, un toque alterna la carta en lugar de mantener.
            if visible { visible = false } else { mostrar() }
        }
        .accessibilityIdentifier("zonaDelDedo")
    }

    private func mostrar() {
        visible = true
        alVer()
    }
}

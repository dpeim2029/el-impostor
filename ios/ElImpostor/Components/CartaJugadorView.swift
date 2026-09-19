import SwiftUI
import ImpostorCore

/// La carta secreta: un sobre blanco, igual para todos, que se abre mientras el jugador mantiene el
/// dedo en la zona de abajo. Abierta, es menta con la palabra (civil) o coral con "Eres el impostor"
/// y su pista. Se cierra al soltar, al cambiar de app o al recibir una llamada.
struct CartaJugadorView: View {
    var nombre: String
    var rol: Rol
    var palabra: Palabra
    var conPista: Bool
    @Binding var visible: Bool
    var alVer: () -> Void

    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        VStack(spacing: 14) {
            panel
            zonaDelDedo
        }
        .onChange(of: scenePhase) { _, nueva in
            if nueva != .active { visible = false }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.willResignActiveNotification)) { _ in
            visible = false
        }
        .sensoryFeedback(.impact(weight: .medium), trigger: visible)
        .onAppear {
            if ArgumentosDeDepuracion.mostrarCarta { mostrar() }
        }
    }

    private var fondo: Color {
        guard visible else { return .tarjeta }
        return rol == .impostor ? .coral : .menta
    }

    private var panel: some View {
        ZStack {
            if visible {
                abierta
                    .transition(.scale(scale: 0.94).combined(with: .opacity))
            } else {
                cerrada
                    .transition(.opacity)
            }
        }
        .frame(maxWidth: .infinity)
        .frame(minHeight: visible ? 330 : 250)
        .padding(.horizontal, 22)
        .padding(.vertical, 28)
        .background(fondo, in: .rect(cornerRadius: 30))
        .shadow(color: .black.opacity(visible ? 0.18 : 0.08), radius: visible ? 35 : 20, y: visible ? 16 : 8)
        .shadow(color: .black.opacity(0.04), radius: 1, y: 1)
        .animation(.spring(duration: 0.35, bounce: 0.25), value: visible)
        .accessibilityIdentifier("cartaPanel")
    }

    private var cerrada: some View {
        VStack(spacing: 14) {
            Image(systemName: "envelope")
                .font(.system(size: 56, weight: .light))
                .foregroundStyle(Color.textoTerciario)
            Text("Solo para \(nombre)")
                .font(.apoyo)
                .foregroundStyle(Color.textoSecundario)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Carta cerrada, solo para \(nombre)")
    }

    @ViewBuilder
    private var abierta: some View {
        VStack(spacing: 16) {
            if rol == .impostor {
                LogoImpostor(color: .rojo)
                    .frame(width: 44, height: 44)
                Text("Eres el impostor")
                    .font(.impostor)
                    .textCase(.uppercase)
                    .foregroundStyle(Color.rojo)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.7)
                if conPista {
                    Pastilla(contenido: Text("Pista: **\(palabra.pista)**"), relleno: Color.white.opacity(0.85))
                }
            } else {
                Image(systemName: "eye")
                    .font(.system(size: 40, weight: .medium))
                    .foregroundStyle(Color.tinta)
                Text(palabra.texto)
                    .font(.palabra)
                    .foregroundStyle(Color.tinta)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.6)
                Pastilla(contenido: Text("\(palabra.categoriaEmoji) \(palabra.categoriaNombre)"), relleno: Color.white.opacity(0.8))
            }
        }
        .accessibilityElement(children: .combine)
    }

    private var zonaDelDedo: some View {
        HStack(spacing: 12) {
            Image(systemName: "hand.tap.fill")
                .font(.system(size: 24, weight: .semibold))
            Text(visible ? "Suelta para ocultar" : "Mantén el dedo aquí")
                .font(.boton)
        }
        .foregroundStyle(visible ? Color.white : Color.tinta)
        .frame(maxWidth: .infinity)
        .frame(height: 84)
        .background(visible ? Color.tinta : Color.clear, in: .rect(cornerRadius: 28))
        .overlay(RoundedRectangle(cornerRadius: 28).strokeBorder(Color.tinta, lineWidth: 2))
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

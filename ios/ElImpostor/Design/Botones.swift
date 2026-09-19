import SwiftUI

/// Botón principal: cápsula negra de 56 pt. Uno por pantalla.
struct PrimarioButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.boton)
            .foregroundStyle(habilitado ? Color.white : Color.textoDeshabilitado)
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 56)
            .background(habilitado ? Color.tinta : Color.deshabilitado, in: .capsule)
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .opacity(configuration.isPressed ? 0.85 : 1)
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
            .animation(.snappy(duration: 0.2), value: habilitado)
    }
}

/// Botón con borde: cápsula blanca con contorno fino, para la acción secundaria de una tarjeta.
struct BordeButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.boton)
            .foregroundStyle(Color.tinta)
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 56)
            .background(Color.tarjeta, in: .capsule)
            .overlay(Capsule().strokeBorder(Color.borde, lineWidth: 1.5))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .opacity(configuration.isPressed ? 0.7 : (habilitado ? 1 : 0.4))
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
    }
}

/// Botón secundario: solo texto, 48 pt.
struct SecundarioButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.boton)
            .foregroundStyle(Color.tinta)
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 48)
            .contentShape(.rect)
            .opacity(configuration.isPressed ? 0.5 : (habilitado ? 1 : 0.4))
    }
}

/// Botón circular de ícono para la cabecera (regresar, cancelar), con vidrio de iOS 26.
struct IconoButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundStyle(Color.tinta)
            .frame(width: 38, height: 38)
            .glassEffect(.regular.interactive(), in: .circle)
            .scaleEffect(configuration.isPressed ? 0.92 : 1)
            .opacity(habilitado ? 1 : 0.35)
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
    }
}

extension ButtonStyle where Self == PrimarioButtonStyle {
    static var primario: PrimarioButtonStyle { PrimarioButtonStyle() }
}

extension ButtonStyle where Self == BordeButtonStyle {
    static var borde: BordeButtonStyle { BordeButtonStyle() }
}

extension ButtonStyle where Self == SecundarioButtonStyle {
    static var secundario: SecundarioButtonStyle { SecundarioButtonStyle() }
}

extension ButtonStyle where Self == IconoButtonStyle {
    static var icono: IconoButtonStyle { IconoButtonStyle() }
}

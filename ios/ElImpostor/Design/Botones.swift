import SwiftUI

/// Botón principal: 56 pt, ámbar, con Liquid Glass. Uno por pantalla.
struct PrimarioButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        // El vidrio se compone en su propia capa e ignora `.opacity` del ancestro: para el estado
        // deshabilitado se atenúa el color y se quita el vidrio.
        configuration.label
            .font(.boton)
            .foregroundStyle(Color.ambarTexto.opacity(habilitado ? 1 : 0.5))
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 56)
            .background(Color.ambar.opacity(habilitado ? 1 : 0.3), in: .rect(cornerRadius: 20))
            .glassEffect(
                habilitado ? .regular.tint(Color.ambar.opacity(0.85)).interactive() : .identity,
                in: .rect(cornerRadius: 20)
            )
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
            .animation(.snappy(duration: 0.2), value: habilitado)
    }
}

/// Botón secundario: 48 pt, sin fondo, texto apagado.
struct SecundarioButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.fila)
            .foregroundStyle(Color.textoApagado)
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 48)
            .contentShape(.rect)
            .opacity(configuration.isPressed ? 0.6 : (habilitado ? 1 : 0.4))
    }
}

/// Botón circular de ícono para la cabecera (regresar, cancelar).
struct IconoButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.fila)
            .foregroundStyle(Color.texto)
            .frame(width: 40, height: 40)
            .glassEffect(.regular.interactive(), in: .circle)
            .scaleEffect(configuration.isPressed ? 0.92 : 1)
            .opacity(habilitado ? 1 : 0.35)
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
    }
}

/// Botón de ícono pequeño y plano para filas de lista.
struct IconoPlanoButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var habilitado

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .semibold))
            .foregroundStyle(Color.textoApagado)
            .frame(width: 36, height: 36)
            .contentShape(.rect)
            .opacity(configuration.isPressed ? 0.5 : (habilitado ? 1 : 0.25))
    }
}

/// Fila seleccionable de 56 pt (lista de votación).
struct FilaButtonStyle: ButtonStyle {
    var tinte: Color?

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.fila)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 56)
            .padding(.horizontal, 16)
            .tarjeta(
                relleno: tinte.map { $0.opacity(0.12) } ?? Color.tarjeta.opacity(0.7),
                borde: tinte.map { $0.opacity(0.5) } ?? Color.borde
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.snappy(duration: 0.15), value: configuration.isPressed)
    }
}

extension ButtonStyle where Self == PrimarioButtonStyle {
    static var primario: PrimarioButtonStyle { PrimarioButtonStyle() }
}

extension ButtonStyle where Self == SecundarioButtonStyle {
    static var secundario: SecundarioButtonStyle { SecundarioButtonStyle() }
}

extension ButtonStyle where Self == IconoButtonStyle {
    static var icono: IconoButtonStyle { IconoButtonStyle() }
}

extension ButtonStyle where Self == IconoPlanoButtonStyle {
    static var iconoPlano: IconoPlanoButtonStyle { IconoPlanoButtonStyle() }
}

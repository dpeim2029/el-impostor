import SwiftUI

/// Tarjeta blanca con sombra suave; `elevada` para la carta abierta y las modales.
struct TarjetaBlancaModifier: ViewModifier {
    var radio: CGFloat
    var elevada: Bool

    func body(content: Content) -> some View {
        content
            .background(Color.tarjeta, in: .rect(cornerRadius: radio))
            .shadow(color: .black.opacity(elevada ? 0.18 : 0.08), radius: elevada ? 35 : 20, y: elevada ? 16 : 8)
            .shadow(color: .black.opacity(0.04), radius: 1, y: 1)
    }
}

extension View {
    func tarjetaBlanca(radio: CGFloat = 30, elevada: Bool = false) -> some View {
        modifier(TarjetaBlancaModifier(radio: radio, elevada: elevada))
    }
}

/// Pastilla de texto (categoría, pista, estado).
struct Pastilla: View {
    var contenido: Text
    var relleno: Color = .rellenoClaro
    var color: Color = .tinta

    var body: some View {
        contenido
            .font(.pastilla)
            .foregroundStyle(color)
            .lineLimit(1)
            .minimumScaleFactor(0.8)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(relleno, in: .capsule)
    }
}

/// Pastilla chica de estado (Atrapado / Se escapó).
struct PastillaEstado: View {
    var texto: LocalizedStringKey
    var relleno: Color
    var color: Color

    var body: some View {
        Text(texto)
            .font(.system(size: 12, weight: .bold))
            .foregroundStyle(color)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(relleno, in: .capsule)
    }
}

/// Cuadro de color con un ícono, para las tarjetas modales.
struct TileIcono<Contenido: View>: View {
    var color: Color
    @ViewBuilder var contenido: () -> Contenido

    var body: some View {
        contenido()
            .frame(width: 84, height: 84)
            .background(color, in: .rect(cornerRadius: 24))
    }
}

/// Número dentro de un círculo, para listas ordenadas.
struct NumeroCirculo: View {
    var numero: Int
    var tamano: CGFloat = 28
    var relleno: Color = .rellenoClaro
    var color: Color = .textoSecundario

    var body: some View {
        Text("\(numero)")
            .font(.system(size: tamano * 0.45, weight: .bold))
            .foregroundStyle(color)
            .frame(width: tamano, height: tamano)
            .background(relleno, in: .circle)
    }
}

/// Etiqueta pequeña en mayúsculas.
struct EtiquetaSeccion: View {
    var texto: LocalizedStringKey

    var body: some View {
        Text(texto)
            .font(.etiqueta)
            .textCase(.uppercase)
            .tracking(1)
            .foregroundStyle(Color.textoSecundario)
    }
}

/// Contenedor blanco redondeado para filas, al estilo de las listas agrupadas de iOS.
struct GrupoBlanco<Contenido: View>: View {
    @ViewBuilder var contenido: () -> Contenido

    var body: some View {
        VStack(spacing: 0) {
            contenido()
        }
        .background(Color.tarjeta, in: .rect(cornerRadius: 22))
        .shadow(color: .black.opacity(0.04), radius: 1, y: 1)
    }
}

/// Separador de filas dentro de un `GrupoBlanco`.
struct Separador: View {
    var body: some View {
        Rectangle()
            .fill(Color.separador)
            .frame(height: 1)
            .padding(.leading, 16)
    }
}

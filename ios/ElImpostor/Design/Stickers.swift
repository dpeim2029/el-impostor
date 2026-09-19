import SwiftUI

// Toques de libreta del diseño "Papel y stickers": marcador, marcos de color y calcomanías numeradas.

/// Texto con un marcador de color detrás, ligeramente girado como trazo a mano.
struct Marcador: ViewModifier {
    var color: Color
    var giro: Double = -1.5

    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 10)
            .background(color, in: .rect(cornerRadius: 10))
            .rotationEffect(.degrees(giro))
    }
}

extension View {
    func marcador(_ color: Color, giro: Double = -1.5) -> some View {
        modifier(Marcador(color: color, giro: giro))
    }
}

/// Posición de una fila dentro de su sección, para dibujar el marco de color y la tarjeta blanca interior.
enum PosicionEnGrupo {
    case unica, primera, media, ultima

    var esPrimera: Bool { self == .unica || self == .primera }
    var esUltima: Bool { self == .unica || self == .ultima }

    static func de(indice: Int, total: Int) -> PosicionEnGrupo {
        if total <= 1 { return .unica }
        if indice == 0 { return .primera }
        if indice == total - 1 { return .ultima }
        return .media
    }
}

/// Fondo de fila para `List`: marco de color alrededor de una tarjeta blanca continua.
struct FondoDeSeccion: View {
    var marco: Color
    var posicion: PosicionEnGrupo

    private let margen: CGFloat = 8
    private let radio: CGFloat = 16

    var body: some View {
        ZStack(alignment: .top) {
            marco
            UnevenRoundedRectangle(
                topLeadingRadius: posicion.esPrimera ? radio : 0,
                bottomLeadingRadius: posicion.esUltima ? radio : 0,
                bottomTrailingRadius: posicion.esUltima ? radio : 0,
                topTrailingRadius: posicion.esPrimera ? radio : 0
            )
            .fill(Color.tarjeta)
            .padding(.horizontal, margen)
            .padding(.top, posicion.esPrimera ? margen : 0)
            .padding(.bottom, posicion.esUltima ? margen : 0)
            if !posicion.esPrimera {
                Rectangle()
                    .fill(Color.separador)
                    .frame(height: 1)
                    .padding(.leading, margen + 16)
                    .padding(.trailing, margen)
            }
        }
    }
}

/// Encabezado de sección en negro y mayúsculas, más contundente que el gris nativo.
struct EncabezadoDeSeccion: View {
    var texto: LocalizedStringKey

    var body: some View {
        Text(texto)
            .font(.system(size: Tipografia.escalado(13, como: .caption1), weight: .heavy))
            .textCase(.uppercase)
            .tracking(1)
            .foregroundStyle(Color.tinta)
    }
}

/// Calcomanía numerada, ligeramente girada, para las instrucciones.
struct Calcomania: View {
    var numero: Int
    var color: Color

    var body: some View {
        NumeroCirculo(numero: numero, tamano: 30, relleno: color, color: .tinta)
            .rotationEffect(.degrees(numero.isMultiple(of: 2) ? -8 : 8))
    }
}

/// Etiqueta pegada en una esquina, como en un sobre.
struct EtiquetaSticker: View {
    var texto: LocalizedStringKey
    var color: Color = .amarillo
    var giro: Double = -6

    var body: some View {
        Text(texto)
            .font(.system(size: Tipografia.escalado(13, como: .caption1), weight: .heavy))
            .textCase(.uppercase)
            .tracking(0.8)
            .foregroundStyle(Color.tinta)
            .lineLimit(1)
            .padding(.horizontal, 14)
            .padding(.vertical, 6)
            .background(color, in: .capsule)
            .shadow(color: .black.opacity(0.12), radius: 4, y: 2)
            .rotationEffect(.degrees(giro))
    }
}

/// Título de cabecera como pastilla amarilla girada.
struct PastillaTitulo: View {
    var texto: LocalizedStringKey

    var body: some View {
        Text(texto)
            .font(.system(size: Tipografia.escalado(14, como: .subheadline), weight: .bold))
            .foregroundStyle(Color.tinta)
            .lineLimit(1)
            .padding(.horizontal, 12)
            .padding(.vertical, 5)
            .background(Color.amarillo, in: .capsule)
            .rotationEffect(.degrees(-2))
    }
}

/// Marco de color alrededor de un grupo blanco, como las secciones de Nueva partida.
struct MarcoDeColor<Contenido: View>: View {
    var color: Color
    @ViewBuilder var contenido: () -> Contenido

    var body: some View {
        contenido()
            .padding(8)
            .background(color, in: .rect(cornerRadius: 22))
    }
}

extension Color {
    /// Colores de calcomanía en orden, para alternar.
    static let stickers: [Color] = [.amarillo, .lila, .durazno, .cielo, .mentaFuerte]
}

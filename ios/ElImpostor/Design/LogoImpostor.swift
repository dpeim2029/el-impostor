import SwiftUI

/// El logo: sombrero de detective sobre unos lentes redondos. Misma geometría que `public/favicon.svg`
/// (lienzo de 512), dibujada como vector para escalar sin pérdida.
struct LogoImpostor: View {
    var color: Color = .tinta

    var body: some View {
        Canvas { contexto, tamano in
            let escala = min(tamano.width, tamano.height) / 512
            contexto.translateBy(
                x: (tamano.width - 512 * escala) / 2,
                y: (tamano.height - 512 * escala) / 2
            )
            contexto.scaleBy(x: escala, y: escala)

            // Copa del sombrero
            var copa = Path()
            copa.move(to: CGPoint(x: 174, y: 236))
            copa.addLine(to: CGPoint(x: 192, y: 124))
            copa.addQuadCurve(to: CGPoint(x: 320, y: 124), control: CGPoint(x: 256, y: 92))
            copa.addLine(to: CGPoint(x: 338, y: 236))
            copa.closeSubpath()
            contexto.fill(copa, with: .color(color))

            // Ala
            let ala = Path(ellipseIn: CGRect(x: 256 - 146, y: 242 - 28, width: 292, height: 56))
            contexto.fill(ala, with: .color(color))

            // Lentes
            let trazo = StrokeStyle(lineWidth: 24, lineCap: .round)
            let izquierdo = Path(ellipseIn: CGRect(x: 194 - 48, y: 336 - 48, width: 96, height: 96))
            let derecho = Path(ellipseIn: CGRect(x: 318 - 48, y: 336 - 48, width: 96, height: 96))
            contexto.stroke(izquierdo, with: .color(color), style: trazo)
            contexto.stroke(derecho, with: .color(color), style: trazo)
            var puente = Path()
            puente.move(to: CGPoint(x: 242, y: 336))
            puente.addLine(to: CGPoint(x: 270, y: 336))
            contexto.stroke(puente, with: .color(color), style: trazo)
        }
        .accessibilityHidden(true)
    }
}

#Preview {
    ZStack {
        Color.papel
        LogoImpostor()
            .frame(width: 160, height: 160)
    }
}

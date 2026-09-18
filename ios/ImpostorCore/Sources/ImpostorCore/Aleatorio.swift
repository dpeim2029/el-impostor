// Fuente de aleatoriedad inyectable. Se conserva la semántica de la web (`rng()` en [0, 1) y
// `Math.floor(rng() * n)`) para que los tests con semilla den exactamente lo mismo.

public protocol FuenteAleatoria: Sendable {
    /// Devuelve un número en [0, 1).
    mutating func siguiente() -> Double
}

/// Aleatoriedad del sistema, para el juego real.
public struct AleatoriaSistema: FuenteAleatoria {
    public init() {}

    public mutating func siguiente() -> Double {
        Double.random(in: 0..<1)
    }
}

/// Generador lineal congruencial; el mismo de los tests de la web, para pruebas reproducibles.
public struct LCG: FuenteAleatoria {
    private var estado: UInt32

    public init(semilla: UInt32 = 1) {
        estado = semilla
    }

    public mutating func siguiente() -> Double {
        estado = estado &* 1_664_525 &+ 1_013_904_223
        return Double(estado) / 4_294_967_296
    }
}

/// Siempre devuelve el mismo valor; útil para fijar un resultado en pruebas.
public struct Constante: FuenteAleatoria {
    public var valor: Double

    public init(_ valor: Double) {
        self.valor = valor
    }

    public mutating func siguiente() -> Double {
        valor
    }
}

/// Índice en `0..<largo` a partir de un número en [0, 1); equivalente a `indiceAleatorio` de engine.ts.
func indiceAleatorio(_ largo: Int, _ rng: inout some FuenteAleatoria) -> Int {
    precondition(largo > 0, "indiceAleatorio necesita al menos un elemento")
    let bruto = Int((rng.siguiente() * Double(largo)).rounded(.down))
    return min(largo - 1, max(0, bruto))
}

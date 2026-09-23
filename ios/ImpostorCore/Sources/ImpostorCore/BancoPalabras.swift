import Foundation

/// Banco de palabras de un idioma. Se carga de `data/words.<idioma>.json`, el mismo archivo que
/// exporta la web con `pnpm words:export`.
public struct BancoPalabras: Codable, Sendable, Equatable {
    public var idioma: String
    public var version: Int
    public var categorias: [Categoria]
    public var totalPalabras: Int

    public init(idioma: String, version: Int, categorias: [Categoria], totalPalabras: Int) {
        self.idioma = idioma
        self.version = version
        self.categorias = categorias
        self.totalPalabras = totalPalabras
    }

    public var idsDeCategorias: [String] {
        categorias.map(\.id)
    }

    public static func cargar(desde url: URL) throws -> BancoPalabras {
        let datos = try Data(contentsOf: url)
        return try JSONDecoder().decode(BancoPalabras.self, from: datos)
    }

    public enum ErrorCarga: Error, Equatable {
        case recursoNoEncontrado(String)
    }

    /// Busca `words.<idioma>.json` en el bundle; si no existe cae a `es-MX`.
    public static func cargar(idioma: String = "es-MX", en bundle: Bundle) throws -> BancoPalabras {
        let candidatos = [idioma, "es-MX"]
        for candidato in candidatos {
            if let url = bundle.url(forResource: "words.\(candidato)", withExtension: "json") {
                return try cargar(desde: url)
            }
        }
        throw ErrorCarga.recursoNoEncontrado("words.\(idioma).json")
    }
}

public func palabrasDeCategoria(_ categoria: Categoria) -> [Palabra] {
    categoria.grupos.flatMap { grupo in
        grupo.palabras.map { texto in
            Palabra(
                texto: texto,
                pista: grupo.pista,
                categoriaId: categoria.id,
                categoriaNombre: categoria.nombre,
                categoriaEmoji: categoria.emoji
            )
        }
    }
}

/// Categorías del banco original (versión 1), para saber cuáles son nuevas en datos guardados.
public let idsBancoV1 = [
    "animales", "comida", "frutas-verduras", "casa", "escuela", "profesiones",
    "deportes", "transporte", "lugares", "naturaleza", "fiestas", "musica",
]

/// Categorías activas por defecto: todas, menos las regionales fuera de su región.
public func categoriasPorDefecto(_ categorias: [Categoria], region: String?) -> [String] {
    categorias
        .filter { categoria in
            guard let regiones = categoria.regiones else { return true }
            return region.map(regiones.contains) ?? false
        }
        .map(\.id)
}

/// Clave con la que se registra una palabra ya jugada: `categoriaId:texto`.
public func clavePalabra(categoriaId: String, texto: String) -> String {
    "\(categoriaId):\(texto)"
}

public func clavePalabra(_ palabra: Palabra) -> String {
    clavePalabra(categoriaId: palabra.categoriaId, texto: palabra.texto)
}

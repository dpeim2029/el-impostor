import Foundation
import Testing
@testable import ImpostorCore

// Reglas de la pista lejana, espejo de src/data/words.test.ts.

private func normalizar(_ texto: String) -> String {
    texto.folding(options: [.diacriticInsensitive], locale: nil)
        .lowercased()
        .trimmingCharacters(in: .whitespacesAndNewlines)
}

/// Quita plurales simples para detectar "Tamal" vs "Tamales".
private func raiz(_ texto: String) -> String {
    let base = normalizar(texto)
    if base.hasSuffix("es") { return String(base.dropLast(2)) }
    if base.hasSuffix("s") { return String(base.dropLast(1)) }
    return base
}

@Suite("banco de palabras")
struct BancoPalabrasTests {
    let banco = BancoDelRepo.banco

    @Test("tiene 13 categorías con ids únicos")
    func treceCategorias() {
        #expect(banco.categorias.count == 13)
        #expect(Set(banco.idsDeCategorias).count == banco.categorias.count)
        #expect(banco.idioma == "es-MX")
    }

    @Test("las categorías de la versión 1 siguen existiendo")
    func categoriasV1() {
        for id in idsBancoV1 {
            #expect(banco.idsDeCategorias.contains(id), "\(id)")
        }
    }

    @Test("la categoría México viene activa por defecto solo en México")
    func categoriaRegional() {
        #expect(categoriasPorDefecto(banco.categorias, region: "MX").contains("mexico"))
        #expect(!categoriasPorDefecto(banco.categorias, region: "AR").contains("mexico"))
        #expect(!categoriasPorDefecto(banco.categorias, region: nil).contains("mexico"))
        #expect(categoriasPorDefecto(banco.categorias, region: "AR").contains("comida"))
    }

    @Test("el banco en inglés se carga con las mismas categorías y la regional de EE. UU.")
    func bancoIngles() throws {
        let url = BancoDelRepo.url.deletingLastPathComponent().appendingPathComponent("words.en.json")
        let ingles = try BancoPalabras.cargar(desde: url)
        #expect(ingles.idioma == "en")
        #expect(Set(ingles.idsDeCategorias) == Set(banco.idsDeCategorias.filter { $0 != "mexico" } + ["usa"]))
        #expect(categoriasPorDefecto(ingles.categorias, region: "US").contains("usa"))
        #expect(!categoriasPorDefecto(ingles.categorias, region: "GB").contains("usa"))
    }

    @Test("cada categoría tiene al menos 25 palabras")
    func minimoPalabras() {
        for categoria in banco.categorias {
            #expect(palabrasDeCategoria(categoria).count >= 25, "\(categoria.nombre)")
        }
    }

    @Test("totalPalabras coincide con la suma")
    func total() {
        let suma = banco.categorias.reduce(0) { $0 + palabrasDeCategoria($1).count }
        #expect(banco.totalPalabras == suma)
    }

    @Test("clavePalabra usa el formato de la web")
    func clave() {
        #expect(clavePalabra(categoriaId: "comida", texto: "Pizza") == "comida:Pizza")
    }

    @Test("no repite palabras", arguments: BancoDelRepo.categorias)
    func noRepite(categoria: Categoria) {
        var vistas: [String: String] = [:]
        for palabra in palabrasDeCategoria(categoria) {
            let clave = normalizar(palabra.texto)
            #expect(vistas[clave] == nil, "\"\(palabra.texto)\" repetida (ya estaba \"\(vistas[clave] ?? "")\")")
            vistas[clave] = palabra.texto
        }
    }

    @Test("cada pista es compartida por 2 o más palabras (regla de ambigüedad)", arguments: BancoDelRepo.categorias)
    func pistaCompartida(categoria: Categoria) {
        for grupo in categoria.grupos {
            #expect(grupo.palabras.count >= 2, "pista \"\(grupo.pista)\"")
        }
    }

    @Test("las pistas no están vacías y no se repiten entre grupos", arguments: BancoDelRepo.categorias)
    func pistasUnicas(categoria: Categoria) {
        let pistas = categoria.grupos.map { normalizar($0.pista) }
        for pista in pistas { #expect(!pista.isEmpty) }
        #expect(Set(pistas).count == pistas.count)
    }

    @Test("ninguna pista es igual, contiene o está contenida en su palabra", arguments: BancoDelRepo.categorias)
    func pistaNoContenida(categoria: Categoria) {
        for palabra in palabrasDeCategoria(categoria) {
            let p = normalizar(palabra.pista), t = normalizar(palabra.texto)
            #expect(p != t, "pista \"\(palabra.pista)\" para \"\(palabra.texto)\"")
            #expect(raiz(palabra.pista) != raiz(palabra.texto), "pista \"\(palabra.pista)\" para \"\(palabra.texto)\"")
            #expect(!t.contains(p), "pista \"\(palabra.pista)\" está dentro de \"\(palabra.texto)\"")
            #expect(!p.contains(t), "palabra \"\(palabra.texto)\" está dentro de la pista \"\(palabra.pista)\"")
        }
    }

    @Test("ninguna pista es otra palabra de la misma categoría", arguments: BancoDelRepo.categorias)
    func pistaNoEsPalabra(categoria: Categoria) {
        let textos = Set(palabrasDeCategoria(categoria).map { raiz($0.texto) })
        for grupo in categoria.grupos {
            #expect(!textos.contains(raiz(grupo.pista)), "pista \"\(grupo.pista)\"")
        }
    }
}

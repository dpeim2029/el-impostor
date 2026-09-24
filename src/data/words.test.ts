import { describe, expect, it } from 'vitest'
import type { Categoria } from '@/game/types'
import { categorias, categoriasPorDefecto, IDS_BANCO_V1, palabrasDeCategoria } from './words'
import { categoriasEn } from './words-en'

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function raiz(texto: string): string {
  // Quita plurales simples para detectar "Tamal" vs "Tamales".
  return normalizar(texto).replace(/(es|s)$/, '')
}

const bancos: [string, Categoria[]][] = [
  ['español', categorias],
  ['inglés', categoriasEn],
]

describe('categorías regionales', () => {
  it('México solo en MX y USA solo en US', () => {
    expect(categoriasPorDefecto('MX')).toContain('mexico')
    expect(categoriasPorDefecto('ES')).not.toContain('mexico')
    expect(categoriasPorDefecto('US', categoriasEn)).toContain('usa')
    expect(categoriasPorDefecto('GB', categoriasEn)).not.toContain('usa')
  })
})

describe.each(bancos)('banco en %s', (_idioma, categorias) => {
  it('tiene 13 categorías con ids únicos', () => {
    expect(categorias).toHaveLength(13)
    const ids = categorias.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('las categorías de la versión 1 siguen existiendo', () => {
    const ids = categorias.map((c) => c.id)
    for (const id of IDS_BANCO_V1) expect(ids, id).toContain(id)
  })

  it('las categorías regionales usan códigos de región de dos letras', () => {
    for (const { nombre, regiones } of categorias) {
      for (const region of regiones ?? []) expect(region, nombre).toMatch(/^[A-Z]{2}$/)
    }
  })

  it('cada categoría tiene al menos 25 palabras', () => {
    for (const categoria of categorias) {
      expect(palabrasDeCategoria(categoria).length, categoria.nombre).toBeGreaterThanOrEqual(25)
    }
  })

  describe.each(categorias.map((c) => [c.nombre, c] as const))('%s', (_nombre, categoria) => {
    const palabras = palabrasDeCategoria(categoria)

    it('no repite palabras', () => {
      const vistas = new Map<string, string>()
      for (const { texto } of palabras) {
        const clave = normalizar(texto)
        expect(vistas.has(clave), `"${texto}" repetida (ya estaba "${vistas.get(clave)}")`).toBe(
          false,
        )
        vistas.set(clave, texto)
      }
    })

    it('cada pista es compartida por 2 o más palabras (regla de ambigüedad)', () => {
      for (const grupo of categoria.grupos) {
        expect(grupo.palabras.length, `pista "${grupo.pista}"`).toBeGreaterThanOrEqual(2)
      }
    })

    it('las pistas no están vacías y no se repiten entre grupos', () => {
      const pistas = categoria.grupos.map((g) => normalizar(g.pista))
      for (const pista of pistas) expect(pista.length).toBeGreaterThan(0)
      expect(new Set(pistas).size).toBe(pistas.length)
    })

    it('ninguna pista es igual, contiene o está contenida en su palabra', () => {
      for (const { texto, pista } of palabras) {
        const p = normalizar(pista)
        const t = normalizar(texto)
        expect(p, `pista "${pista}" para "${texto}"`).not.toBe(t)
        expect(raiz(pista), `pista "${pista}" para "${texto}"`).not.toBe(raiz(texto))
        expect(t.includes(p), `pista "${pista}" está dentro de "${texto}"`).toBe(false)
        expect(p.includes(t), `palabra "${texto}" está dentro de la pista "${pista}"`).toBe(false)
      }
    })

    it('ninguna pista es otra palabra de la misma categoría', () => {
      const textos = new Set(palabras.map((p) => raiz(p.texto)))
      for (const grupo of categoria.grupos) {
        expect(textos.has(raiz(grupo.pista)), `pista "${grupo.pista}"`).toBe(false)
      }
    })
  })
})

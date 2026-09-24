// Exporta los bancos de palabras a JSON para clientes que no son TypeScript (Swift, Kotlin, servidor).
// Uso: pnpm words:export  ->  data/words.es-MX.json y data/words.en.json
import { mkdirSync, writeFileSync } from 'node:fs'
import type { Categoria } from '../src/game/types'
import { categorias, palabrasDeCategoria } from '../src/data/words'
import { categoriasEn } from '../src/data/words-en'

function exportar(idioma: string, lista: Categoria[]) {
  const salida = {
    idioma,
    version: 1,
    reglas: {
      pista:
        'Cada pista es lejana (segundo grado: origen, contexto, oficio, lugar), no es sinónimo ni parte de la palabra, y la comparten 2 o más palabras del mismo grupo.',
    },
    categorias: lista.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      emoji: c.emoji,
      ...(c.regiones ? { regiones: c.regiones } : {}),
      grupos: c.grupos.map((g) => ({ pista: g.pista, palabras: g.palabras })),
    })),
    totalPalabras: lista.reduce((n, c) => n + palabrasDeCategoria(c).length, 0),
  }
  const ruta = `data/words.${idioma}.json`
  writeFileSync(ruta, JSON.stringify(salida, null, 2) + '\n')
  console.log(`${ruta}: ${salida.categorias.length} categorías, ${salida.totalPalabras} palabras`)
}

mkdirSync('data', { recursive: true })
exportar('es-MX', categorias)
exportar('en', categoriasEn)

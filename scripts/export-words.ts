// Exporta el banco de palabras a JSON para clientes que no son TypeScript (Swift, Kotlin, servidor).
// Uso: pnpm words:export  ->  data/words.es-MX.json
import { mkdirSync, writeFileSync } from 'node:fs'
import { categorias, palabrasDeCategoria } from '../src/data/words'

const salida = {
  idioma: 'es-MX',
  version: 1,
  reglas: {
    pista:
      'Cada pista es lejana (segundo grado: origen, contexto, oficio, lugar), no es sinónimo ni parte de la palabra, y la comparten 2 o más palabras del mismo grupo.',
  },
  categorias: categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    emoji: c.emoji,
    ...(c.regiones ? { regiones: c.regiones } : {}),
    grupos: c.grupos.map((g) => ({ pista: g.pista, palabras: g.palabras })),
  })),
  totalPalabras: categorias.reduce((n, c) => n + palabrasDeCategoria(c).length, 0),
}

mkdirSync('data', { recursive: true })
writeFileSync('data/words.es-MX.json', JSON.stringify(salida, null, 2) + '\n')
console.log(`data/words.es-MX.json: ${salida.categorias.length} categorías, ${salida.totalPalabras} palabras`)

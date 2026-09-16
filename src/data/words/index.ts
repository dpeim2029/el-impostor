import type { Categoria, Palabra } from '@/game/types'
import { animales } from './animales'
import { casa } from './casa'
import { comida } from './comida'
import { deportes } from './deportes'
import { escuela } from './escuela'
import { fiestas } from './fiestas'
import { frutasVerduras } from './frutas-verduras'
import { lugares } from './lugares'
import { musica } from './musica'
import { naturaleza } from './naturaleza'
import { profesiones } from './profesiones'
import { transporte } from './transporte'

export const categorias: Categoria[] = [
  animales,
  comida,
  frutasVerduras,
  casa,
  escuela,
  profesiones,
  deportes,
  transporte,
  lugares,
  naturaleza,
  fiestas,
  musica,
]

export function palabrasDeCategoria(categoria: Categoria): Palabra[] {
  return categoria.grupos.flatMap((grupo) =>
    grupo.palabras.map((texto) => ({
      texto,
      pista: grupo.pista,
      categoriaId: categoria.id,
      categoriaNombre: categoria.nombre,
      categoriaEmoji: categoria.emoji,
    })),
  )
}

export function clavePalabra(palabra: Pick<Palabra, 'categoriaId' | 'texto'>): string {
  return `${palabra.categoriaId}:${palabra.texto}`
}

export const totalPalabras = categorias.reduce(
  (suma, categoria) => suma + palabrasDeCategoria(categoria).length,
  0,
)

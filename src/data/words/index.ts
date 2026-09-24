import type { Categoria, Palabra } from '@/game/types'
import { animales } from './animales'
import { casa } from './casa'
import { comida } from './comida'
import { deportes } from './deportes'
import { escuela } from './escuela'
import { fiestas } from './fiestas'
import { frutasVerduras } from './frutas-verduras'
import { lugares } from './lugares'
import { mexico } from './mexico'
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
  mexico,
]

/** Categorías del banco original (versión 1), para saber cuáles son nuevas en datos guardados. */
export const IDS_BANCO_V1 = [
  'animales',
  'comida',
  'frutas-verduras',
  'casa',
  'escuela',
  'profesiones',
  'deportes',
  'transporte',
  'lugares',
  'naturaleza',
  'fiestas',
  'musica',
]

/** Categorías activas por defecto: todas, menos las regionales fuera de su región. */
export function categoriasPorDefecto(region: string | undefined, lista = categorias): string[] {
  return lista
    .filter((c) => !c.regiones || (region !== undefined && c.regiones.includes(region)))
    .map((c) => c.id)
}

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

export interface GrupoPista {
  /** Pista lejana compartida por todas las palabras del grupo. */
  pista: string
  palabras: string[]
}

export interface Categoria {
  id: string
  nombre: string
  emoji: string
  /** Códigos de región (ISO 3166, p. ej. "MX") donde la categoría viene activa por defecto; sin
   *  este campo, en todas partes. */
  regiones?: string[]
  grupos: GrupoPista[]
}

export interface Palabra {
  texto: string
  pista: string
  categoriaId: string
  categoriaNombre: string
  categoriaEmoji: string
}

export interface Jugador {
  id: string
  nombre: string
}

export type NumImpostores = 1 | 2

export interface Ajustes {
  numImpostores: NumImpostores
  /** Si el impostor recibe la pista lejana o entra a ciegas. */
  conPista: boolean
  categoriasActivas: string[]
  /** Categorías que ya existían la última vez que se guardó; las nuevas se activan al cargar si
   *  corresponden a la región. Falta en datos de la versión 1 (ver `IDS_BANCO_V1`). */
  categoriasConocidas?: string[]
}

export type Rol = 'civil' | 'impostor'

export interface Ronda {
  palabra: Palabra
  roles: Record<string, Rol>
  /** Ids de jugadores en orden de turno; el primero empieza. */
  orden: string[]
  /** Ids de jugadores acusados, en orden. */
  acusaciones: string[]
  vuelta: number
}

export type Fase =
  | 'inicio'
  | 'como-jugar'
  | 'ajustes'
  | 'reparto'
  | 'ronda'
  | 'votacion'
  | 'resultado'

export interface EstadoJuego {
  fase: Fase
  jugadores: Jugador[]
  ajustes: Ajustes
  ronda: Ronda | null
  /** Índice en `jugadores` del jugador al que le toca ver su carta. */
  indiceReparto: number
  /** Claves `categoriaId:texto` de palabras ya jugadas. */
  palabrasUsadas: string[]
}

export interface ResultadoVoto {
  atrapados: string[]
  escapados: string[]
  civilesAcusados: string[]
  ganaronCiviles: boolean
}

export const MIN_JUGADORES = 3
export const MAX_JUGADORES = 15
export const MIN_JUGADORES_DOS_IMPOSTORES = 6

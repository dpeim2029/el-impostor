import { clavePalabra, palabrasDeCategoria } from '@/data/words'
import {
  MAX_JUGADORES,
  MIN_JUGADORES,
  MIN_JUGADORES_DOS_IMPOSTORES,
  type Ajustes,
  type Categoria,
  type Jugador,
  type NumImpostores,
  type Palabra,
  type ResultadoVoto,
  type Rol,
  type Ronda,
} from './types'

export type Rng = () => number

function indiceAleatorio(largo: number, rng: Rng): number {
  return Math.min(largo - 1, Math.floor(rng() * largo))
}

export function barajar<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = indiceAleatorio(i + 1, rng)
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function maxImpostores(numJugadores: number): NumImpostores {
  return numJugadores >= MIN_JUGADORES_DOS_IMPOSTORES ? 2 : 1
}

export interface PalabraElegida {
  palabra: Palabra
  /** Lista de usadas después de elegir; se reinicia si ya no quedaban palabras. */
  usadas: string[]
  reinicio: boolean
}

export function elegirPalabra(
  categorias: readonly Categoria[],
  categoriasActivas: readonly string[],
  usadas: readonly string[],
  rng: Rng = Math.random,
): PalabraElegida {
  const activas = categorias.filter((c) => categoriasActivas.includes(c.id))
  const fuente = activas.length > 0 ? activas : categorias
  const todas = fuente.flatMap(palabrasDeCategoria)
  if (todas.length === 0) throw new Error('No hay palabras disponibles')

  const yaUsadas = new Set(usadas)
  let disponibles = todas.filter((p) => !yaUsadas.has(clavePalabra(p)))
  let reinicio = false
  let base = [...usadas]

  if (disponibles.length === 0) {
    // Se agotaron las palabras de las categorías activas: se liberan solo esas.
    const clavesActivas = new Set(todas.map(clavePalabra))
    base = base.filter((clave) => !clavesActivas.has(clave))
    disponibles = todas
    reinicio = true
  }

  const palabra = disponibles[indiceAleatorio(disponibles.length, rng)]
  return { palabra, usadas: [...base, clavePalabra(palabra)], reinicio }
}

export function asignarRoles(
  jugadores: readonly Jugador[],
  numImpostores: number,
  rng: Rng = Math.random,
): Record<string, Rol> {
  const cuantos = Math.min(numImpostores, Math.max(1, jugadores.length - 1))
  const impostores = new Set(
    barajar(jugadores, rng)
      .slice(0, cuantos)
      .map((j) => j.id),
  )
  return Object.fromEntries(
    jugadores.map((j) => [j.id, impostores.has(j.id) ? 'impostor' : 'civil'] as const),
  )
}

/** Orden de turno: empieza alguien al azar y sigue el orden en que están sentados. */
export function ordenDeRonda(jugadores: readonly Jugador[], rng: Rng = Math.random): string[] {
  if (jugadores.length === 0) return []
  const inicio = indiceAleatorio(jugadores.length, rng)
  return jugadores.map((_, i) => jugadores[(inicio + i) % jugadores.length].id)
}

export function crearRonda(
  jugadores: readonly Jugador[],
  ajustes: Ajustes,
  categorias: readonly Categoria[],
  usadas: readonly string[],
  rng: Rng = Math.random,
): { ronda: Ronda; usadas: string[] } {
  const eleccion = elegirPalabra(categorias, ajustes.categoriasActivas, usadas, rng)
  const numImpostores = Math.min(ajustes.numImpostores, maxImpostores(jugadores.length))
  return {
    ronda: {
      palabra: eleccion.palabra,
      roles: asignarRoles(jugadores, numImpostores, rng),
      orden: ordenDeRonda(jugadores, rng),
      acusaciones: [],
      vuelta: 1,
    },
    usadas: eleccion.usadas,
  }
}

export function impostoresDe(ronda: Ronda): string[] {
  return Object.entries(ronda.roles)
    .filter(([, rol]) => rol === 'impostor')
    .map(([id]) => id)
}

export function acusacionesPermitidas(ronda: Ronda): number {
  return impostoresDe(ronda).length
}

export function resolverVoto(ronda: Ronda, acusaciones: readonly string[] = ronda.acusaciones): ResultadoVoto {
  const impostores = impostoresDe(ronda)
  const atrapados = impostores.filter((id) => acusaciones.includes(id))
  const escapados = impostores.filter((id) => !acusaciones.includes(id))
  const civilesAcusados = acusaciones.filter((id) => ronda.roles[id] === 'civil')
  return {
    atrapados,
    escapados,
    civilesAcusados,
    ganaronCiviles: escapados.length === 0,
  }
}

export interface Validacion {
  valido: boolean
  errores: string[]
}

export function validarPartida(jugadores: readonly Jugador[], ajustes: Ajustes): Validacion {
  const errores: string[] = []
  if (jugadores.length < MIN_JUGADORES) {
    errores.push(`Se necesitan al menos ${MIN_JUGADORES} jugadores.`)
  }
  if (jugadores.length > MAX_JUGADORES) {
    errores.push(`Máximo ${MAX_JUGADORES} jugadores.`)
  }
  const nombres = jugadores.map((j) => j.nombre.trim().toLocaleLowerCase('es'))
  if (nombres.some((n) => n.length === 0)) {
    errores.push('Todos los jugadores necesitan un nombre.')
  }
  if (new Set(nombres).size !== nombres.length) {
    errores.push('Hay nombres repetidos.')
  }
  if (ajustes.numImpostores > maxImpostores(jugadores.length)) {
    errores.push(`Para 2 impostores se necesitan ${MIN_JUGADORES_DOS_IMPOSTORES} jugadores o más.`)
  }
  if (ajustes.categoriasActivas.length === 0) {
    errores.push('Elige al menos una categoría.')
  }
  return { valido: errores.length === 0, errores }
}

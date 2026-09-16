import { categorias } from '@/data/words'
import { crearRonda, maxImpostores } from './engine'
import {
  MAX_JUGADORES,
  type Ajustes,
  type EstadoJuego,
  type Fase,
  type Jugador,
  type NumImpostores,
  type VariantePista,
} from './types'

export const CLAVE_ALMACEN = 'el-impostor:v1'

export const ajustesIniciales: Ajustes = {
  numImpostores: 1,
  variantePista: 'pista-lejana',
  categoriasActivas: categorias.map((c) => c.id),
}

export const estadoInicial: EstadoJuego = {
  fase: 'inicio',
  jugadores: [],
  ajustes: ajustesIniciales,
  ronda: null,
  indiceReparto: 0,
  palabrasUsadas: [],
}

export type Accion =
  | { tipo: 'ir'; fase: Extract<Fase, 'inicio' | 'como-jugar' | 'ajustes'> }
  | { tipo: 'agregarJugador'; nombre: string }
  | { tipo: 'quitarJugador'; id: string }
  | { tipo: 'renombrarJugador'; id: string; nombre: string }
  | { tipo: 'moverJugador'; id: string; direccion: -1 | 1 }
  | { tipo: 'setNumImpostores'; numImpostores: NumImpostores }
  | { tipo: 'setVariantePista'; variantePista: VariantePista }
  | { tipo: 'toggleCategoria'; id: string }
  | { tipo: 'setCategorias'; ids: string[] }
  | { tipo: 'repartir' }
  | { tipo: 'siguienteCarta' }
  | { tipo: 'otraVuelta' }
  | { tipo: 'irAVotar' }
  | { tipo: 'acusar'; id: string }
  | { tipo: 'verResultado' }
  | { tipo: 'otraRonda' }
  | { tipo: 'cancelarRonda' }

function nuevoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function conAjustes(estado: EstadoJuego, cambios: Partial<Ajustes>): EstadoJuego {
  return { ...estado, ajustes: { ...estado.ajustes, ...cambios } }
}

function ajustarImpostores(estado: EstadoJuego): EstadoJuego {
  const maximo = maxImpostores(estado.jugadores.length)
  if (estado.ajustes.numImpostores <= maximo) return estado
  return conAjustes(estado, { numImpostores: maximo })
}

function iniciarRonda(estado: EstadoJuego): EstadoJuego {
  const { ronda, usadas } = crearRonda(
    estado.jugadores,
    estado.ajustes,
    categorias,
    estado.palabrasUsadas,
  )
  return { ...estado, fase: 'reparto', ronda, indiceReparto: 0, palabrasUsadas: usadas }
}

export function reducer(estado: EstadoJuego, accion: Accion): EstadoJuego {
  switch (accion.tipo) {
    case 'ir':
      return { ...estado, fase: accion.fase }

    case 'agregarJugador': {
      const nombre = accion.nombre.trim()
      if (!nombre || estado.jugadores.length >= MAX_JUGADORES) return estado
      const jugador: Jugador = { id: nuevoId(), nombre }
      return { ...estado, jugadores: [...estado.jugadores, jugador] }
    }

    case 'quitarJugador':
      return ajustarImpostores({
        ...estado,
        jugadores: estado.jugadores.filter((j) => j.id !== accion.id),
      })

    case 'renombrarJugador': {
      const nombre = accion.nombre.trim()
      if (!nombre) return estado
      return {
        ...estado,
        jugadores: estado.jugadores.map((j) => (j.id === accion.id ? { ...j, nombre } : j)),
      }
    }

    case 'moverJugador': {
      const desde = estado.jugadores.findIndex((j) => j.id === accion.id)
      const hasta = desde + accion.direccion
      if (desde < 0 || hasta < 0 || hasta >= estado.jugadores.length) return estado
      const jugadores = [...estado.jugadores]
      ;[jugadores[desde], jugadores[hasta]] = [jugadores[hasta], jugadores[desde]]
      return { ...estado, jugadores }
    }

    case 'setNumImpostores':
      return ajustarImpostores(conAjustes(estado, { numImpostores: accion.numImpostores }))

    case 'setVariantePista':
      return conAjustes(estado, { variantePista: accion.variantePista })

    case 'toggleCategoria': {
      const activas = estado.ajustes.categoriasActivas
      const nuevas = activas.includes(accion.id)
        ? activas.filter((id) => id !== accion.id)
        : [...activas, accion.id]
      return conAjustes(estado, { categoriasActivas: nuevas })
    }

    case 'setCategorias':
      return conAjustes(estado, { categoriasActivas: accion.ids })

    case 'repartir':
    case 'otraRonda':
      return iniciarRonda(estado)

    case 'siguienteCarta': {
      if (!estado.ronda) return estado
      const siguiente = estado.indiceReparto + 1
      if (siguiente >= estado.jugadores.length) {
        return { ...estado, fase: 'ronda', indiceReparto: 0 }
      }
      return { ...estado, indiceReparto: siguiente }
    }

    case 'otraVuelta':
      if (!estado.ronda) return estado
      return { ...estado, ronda: { ...estado.ronda, vuelta: estado.ronda.vuelta + 1 } }

    case 'irAVotar':
      if (!estado.ronda) return estado
      return { ...estado, fase: 'votacion' }

    case 'acusar': {
      if (!estado.ronda || estado.ronda.acusaciones.includes(accion.id)) return estado
      return {
        ...estado,
        ronda: { ...estado.ronda, acusaciones: [...estado.ronda.acusaciones, accion.id] },
      }
    }

    case 'verResultado':
      if (!estado.ronda) return estado
      return { ...estado, fase: 'resultado' }

    case 'cancelarRonda':
      return { ...estado, fase: 'ajustes', ronda: null, indiceReparto: 0 }
  }
}

const fasesDeJuego: Fase[] = ['reparto', 'ronda', 'votacion', 'resultado']

export function cargarEstado(almacen: Pick<Storage, 'getItem'> | undefined): EstadoJuego {
  if (!almacen) return estadoInicial
  try {
    const crudo = almacen.getItem(CLAVE_ALMACEN)
    if (!crudo) return estadoInicial
    const guardado = JSON.parse(crudo) as Partial<EstadoJuego>
    const idsValidos = new Set(categorias.map((c) => c.id))
    const activas = Array.isArray(guardado.ajustes?.categoriasActivas)
      ? guardado.ajustes!.categoriasActivas.filter((id) => idsValidos.has(id))
      : ajustesIniciales.categoriasActivas

    const estado: EstadoJuego = {
      ...estadoInicial,
      jugadores: Array.isArray(guardado.jugadores)
        ? guardado.jugadores
            .filter((j) => j && typeof j.id === 'string' && typeof j.nombre === 'string')
            .slice(0, MAX_JUGADORES)
        : [],
      ajustes: {
        numImpostores: guardado.ajustes?.numImpostores === 2 ? 2 : 1,
        variantePista:
          guardado.ajustes?.variantePista === 'sin-pista' ? 'sin-pista' : 'pista-lejana',
        categoriasActivas: activas.length > 0 ? activas : ajustesIniciales.categoriasActivas,
      },
      palabrasUsadas: Array.isArray(guardado.palabrasUsadas)
        ? guardado.palabrasUsadas.filter((p) => typeof p === 'string')
        : [],
    }

    // Una ronda a medias se recupera tal cual para no perder la partida si el navegador recarga.
    if (guardado.ronda && guardado.fase && fasesDeJuego.includes(guardado.fase)) {
      const ronda = guardado.ronda
      const idsJugadores = new Set(estado.jugadores.map((j) => j.id))
      const consistente =
        ronda.palabra &&
        ronda.roles &&
        Array.isArray(ronda.orden) &&
        ronda.orden.every((id) => idsJugadores.has(id)) &&
        estado.jugadores.every((j) => j.id in ronda.roles)
      if (consistente) {
        return {
          ...estado,
          fase: guardado.fase,
          ronda: {
            ...ronda,
            acusaciones: Array.isArray(ronda.acusaciones) ? ronda.acusaciones : [],
            vuelta: typeof ronda.vuelta === 'number' ? ronda.vuelta : 1,
          },
          indiceReparto: Math.min(
            Math.max(0, guardado.indiceReparto ?? 0),
            Math.max(0, estado.jugadores.length - 1),
          ),
        }
      }
    }

    return estado
  } catch {
    return estadoInicial
  }
}

export function guardarEstado(
  almacen: Pick<Storage, 'setItem'> | undefined,
  estado: EstadoJuego,
): void {
  if (!almacen) return
  try {
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(estado))
  } catch {
    // Sin espacio o en modo privado: el juego sigue funcionando en memoria.
  }
}

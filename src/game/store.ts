import { categorias, categoriasPorDefecto, IDS_BANCO_V1 } from '@/data/words'
import { crearRonda, maxImpostores } from './engine'
import {
  MAX_JUGADORES,
  type Ajustes,
  type EstadoJuego,
  type Fase,
  type Jugador,
  type NumImpostores,
} from './types'

export const CLAVE_ALMACEN = 'el-impostor:v1'

/** Zonas horarias de México. En Latinoamérica el navegador suele decir "es-419", sin país. */
const ZONAS_DE_MEXICO = new Set([
  'America/Mexico_City',
  'America/Monterrey',
  'America/Merida',
  'America/Cancun',
  'America/Chihuahua',
  'America/Ciudad_Juarez',
  'America/Hermosillo',
  'America/Mazatlan',
  'America/Tijuana',
  'America/Matamoros',
  'America/Ojinaga',
  'America/Bahia_Banderas',
])

/** Región del navegador ("MX" de "es-MX"), para activar las categorías regionales. Si ningún
 *  idioma trae país, se reconoce México por la zona horaria (la única regional de la web). */
export function regionDelNavegador(): string | undefined {
  if (typeof navigator !== 'undefined') {
    for (const idioma of navigator.languages ?? [navigator.language]) {
      try {
        const region = new Intl.Locale(idioma).region
        // "419" y otras regiones numéricas son continentes, no países.
        if (region && /^[A-Z]{2}$/.test(region)) return region
      } catch {
        // Etiqueta de idioma inválida: se prueba la siguiente.
      }
    }
  }
  try {
    if (ZONAS_DE_MEXICO.has(Intl.DateTimeFormat().resolvedOptions().timeZone)) return 'MX'
  } catch {
    // Sin zona horaria disponible: sin región.
  }
  return undefined
}

export function crearAjustesIniciales(region: string | undefined): Ajustes {
  return {
    numImpostores: 1,
    conPista: true,
    categoriasActivas: categoriasPorDefecto(region),
    categoriasConocidas: categorias.map((c) => c.id),
  }
}

export const ajustesIniciales: Ajustes = crearAjustesIniciales(regionDelNavegador())

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
  | { tipo: 'setConPista'; conPista: boolean }
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

    case 'setConPista':
      return conAjustes(estado, { conPista: accion.conPista })

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

export function cargarEstado(
  almacen: Pick<Storage, 'getItem'> | undefined,
  region: string | undefined = regionDelNavegador(),
): EstadoJuego {
  const iniciales = crearAjustesIniciales(region)
  const inicial: EstadoJuego = { ...estadoInicial, ajustes: iniciales }
  if (!almacen) return inicial
  try {
    const crudo = almacen.getItem(CLAVE_ALMACEN)
    if (!crudo) return inicial
    const guardado = JSON.parse(crudo) as Partial<EstadoJuego>
    const idsValidos = new Set(categorias.map((c) => c.id))
    const guardadas = Array.isArray(guardado.ajustes?.categoriasActivas)
      ? guardado.ajustes!.categoriasActivas.filter((id) => idsValidos.has(id))
      : iniciales.categoriasActivas
    // Las categorías que no existían al guardar se suman si tocan por región (p. ej. "México"
    // para quien jugaba la versión 1 en México); las que el jugador ya conocía se respetan.
    const conocidas = Array.isArray(guardado.ajustes?.categoriasConocidas)
      ? guardado.ajustes!.categoriasConocidas.filter((id) => typeof id === 'string')
      : IDS_BANCO_V1
    const nuevas = iniciales.categoriasActivas.filter(
      (id) => !conocidas.includes(id) && !guardadas.includes(id),
    )
    const activas = guardadas.length > 0 ? [...guardadas, ...nuevas] : iniciales.categoriasActivas

    const estado: EstadoJuego = {
      ...estadoInicial,
      jugadores: Array.isArray(guardado.jugadores)
        ? guardado.jugadores
            .filter((j) => j && typeof j.id === 'string' && typeof j.nombre === 'string')
            .slice(0, MAX_JUGADORES)
        : [],
      ajustes: {
        numImpostores: guardado.ajustes?.numImpostores === 2 ? 2 : 1,
        conPista: guardado.ajustes?.conPista !== false,
        categoriasActivas: activas,
        // Unión, no reemplazo: al cambiar de idioma (bancos con distinta categoría regional) no se
        // olvida que el jugador ya conocía y quizá apagó la del otro banco.
        categoriasConocidas: [...new Set([...conocidas, ...(iniciales.categoriasConocidas ?? [])])],
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
    return inicial
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

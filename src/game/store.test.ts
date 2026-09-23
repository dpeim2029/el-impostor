import { describe, expect, it } from 'vitest'
import {
  CLAVE_ALMACEN,
  ajustesIniciales,
  cargarEstado,
  crearAjustesIniciales,
  estadoInicial,
  guardarEstado,
  reducer,
  type Accion,
} from './store'
import type { EstadoJuego } from './types'

function aplicar(estado: EstadoJuego, ...acciones: Accion[]): EstadoJuego {
  return acciones.reduce(reducer, estado)
}

function conJugadores(nombres: string[]): EstadoJuego {
  return aplicar(
    estadoInicial,
    ...nombres.map((nombre) => ({ tipo: 'agregarJugador', nombre }) as const),
  )
}

class AlmacenFalso {
  datos = new Map<string, string>()
  getItem(clave: string) {
    return this.datos.get(clave) ?? null
  }
  setItem(clave: string, valor: string) {
    this.datos.set(clave, valor)
  }
}

describe('reducer: jugadores', () => {
  it('agrega jugadores recortando espacios e ignora vacíos', () => {
    const estado = conJugadores(['  Ana ', '', 'Luis'])
    expect(estado.jugadores.map((j) => j.nombre)).toEqual(['Ana', 'Luis'])
    expect(new Set(estado.jugadores.map((j) => j.id)).size).toBe(2)
  })

  it('no pasa de 15 jugadores', () => {
    const estado = conJugadores(Array.from({ length: 20 }, (_, i) => `J${i}`))
    expect(estado.jugadores).toHaveLength(15)
  })

  it('mueve, renombra y quita jugadores', () => {
    let estado = conJugadores(['Ana', 'Luis', 'Sofi'])
    const [ana, luis] = estado.jugadores
    estado = aplicar(estado, { tipo: 'moverJugador', id: luis.id, direccion: -1 })
    expect(estado.jugadores.map((j) => j.nombre)).toEqual(['Luis', 'Ana', 'Sofi'])
    estado = aplicar(estado, { tipo: 'moverJugador', id: luis.id, direccion: -1 })
    expect(estado.jugadores[0].id).toBe(luis.id)
    estado = aplicar(estado, { tipo: 'renombrarJugador', id: ana.id, nombre: ' Anita ' })
    expect(estado.jugadores.find((j) => j.id === ana.id)?.nombre).toBe('Anita')
    estado = aplicar(estado, { tipo: 'quitarJugador', id: luis.id })
    expect(estado.jugadores.map((j) => j.nombre)).toEqual(['Anita', 'Sofi'])
  })

  it('baja a 1 impostor si ya no alcanzan los jugadores', () => {
    let estado = conJugadores(['A', 'B', 'C', 'D', 'E', 'F'])
    estado = aplicar(estado, { tipo: 'setNumImpostores', numImpostores: 2 })
    expect(estado.ajustes.numImpostores).toBe(2)
    estado = aplicar(estado, { tipo: 'quitarJugador', id: estado.jugadores[0].id })
    expect(estado.ajustes.numImpostores).toBe(1)
  })

  it('no permite 2 impostores con menos de 6 jugadores', () => {
    const estado = aplicar(conJugadores(['A', 'B', 'C']), {
      tipo: 'setNumImpostores',
      numImpostores: 2,
    })
    expect(estado.ajustes.numImpostores).toBe(1)
  })
})

describe('reducer: ajustes', () => {
  it('alterna y fija categorías', () => {
    let estado = aplicar(estadoInicial, { tipo: 'toggleCategoria', id: 'comida' })
    expect(estado.ajustes.categoriasActivas).not.toContain('comida')
    estado = aplicar(estado, { tipo: 'toggleCategoria', id: 'comida' })
    expect(estado.ajustes.categoriasActivas).toContain('comida')
    estado = aplicar(estado, { tipo: 'setCategorias', ids: ['animales'] })
    expect(estado.ajustes.categoriasActivas).toEqual(['animales'])
  })

  it('activa y desactiva la pista del impostor', () => {
    expect(estadoInicial.ajustes.conPista).toBe(true)
    const estado = aplicar(estadoInicial, { tipo: 'setConPista', conPista: false })
    expect(estado.ajustes.conPista).toBe(false)
  })
})

describe('reducer: flujo de una ronda', () => {
  const base = conJugadores(['Ana', 'Luis', 'Sofi', 'Beto'])

  it('reparte cartas, avanza por cada jugador y pasa a la ronda', () => {
    let estado = aplicar(base, { tipo: 'repartir' })
    expect(estado.fase).toBe('reparto')
    expect(estado.ronda).not.toBeNull()
    expect(estado.indiceReparto).toBe(0)
    expect(estado.palabrasUsadas).toHaveLength(1)
    expect(Object.values(estado.ronda!.roles).filter((r) => r === 'impostor')).toHaveLength(1)

    for (let i = 1; i < 4; i++) {
      estado = aplicar(estado, { tipo: 'siguienteCarta' })
      expect(estado.indiceReparto).toBe(i)
      expect(estado.fase).toBe('reparto')
    }
    estado = aplicar(estado, { tipo: 'siguienteCarta' })
    expect(estado.fase).toBe('ronda')
  })

  it('cuenta vueltas, vota y muestra resultado', () => {
    let estado = aplicar(base, { tipo: 'repartir' }, { tipo: 'otraVuelta' }, { tipo: 'irAVotar' })
    expect(estado.ronda?.vuelta).toBe(2)
    expect(estado.fase).toBe('votacion')
    const [primero] = estado.jugadores
    estado = aplicar(estado, { tipo: 'acusar', id: primero.id }, { tipo: 'acusar', id: primero.id })
    expect(estado.ronda?.acusaciones).toEqual([primero.id])
    estado = aplicar(estado, { tipo: 'verResultado' })
    expect(estado.fase).toBe('resultado')
  })

  it('otra ronda cambia de palabra y cancelar vuelve a ajustes', () => {
    let estado = aplicar(base, { tipo: 'repartir' })
    const primera = estado.ronda!.palabra
    estado = aplicar(estado, { tipo: 'otraRonda' })
    expect(estado.fase).toBe('reparto')
    expect(estado.palabrasUsadas).toHaveLength(2)
    expect(estado.ronda!.palabra).not.toEqual(primera)
    estado = aplicar(estado, { tipo: 'cancelarRonda' })
    expect(estado.fase).toBe('ajustes')
    expect(estado.ronda).toBeNull()
  })

  it('ignora acciones de ronda cuando no hay ronda', () => {
    expect(aplicar(base, { tipo: 'siguienteCarta' })).toBe(base)
    expect(aplicar(base, { tipo: 'irAVotar' })).toBe(base)
    expect(aplicar(base, { tipo: 'acusar', id: 'x' })).toBe(base)
  })
})

describe('persistencia', () => {
  it('devuelve el estado inicial sin almacén o con datos corruptos', () => {
    expect(cargarEstado(undefined)).toEqual(estadoInicial)
    const almacen = new AlmacenFalso()
    almacen.setItem(CLAVE_ALMACEN, '{no es json')
    expect(cargarEstado(almacen)).toEqual(estadoInicial)
  })

  it('guarda y recupera jugadores, ajustes y palabras usadas', () => {
    const almacen = new AlmacenFalso()
    const estado = aplicar(
      conJugadores(['Ana', 'Luis', 'Sofi']),
      { tipo: 'setCategorias', ids: ['comida', 'categoria-inexistente'] },
      { tipo: 'setConPista', conPista: false },
      { tipo: 'repartir' },
    )
    guardarEstado(almacen, estado)
    const recuperado = cargarEstado(almacen)
    expect(recuperado.jugadores).toEqual(estado.jugadores)
    expect(recuperado.ajustes.categoriasActivas).toEqual(['comida'])
    expect(recuperado.ajustes.conPista).toBe(false)
    expect(recuperado.palabrasUsadas).toEqual(estado.palabrasUsadas)
    expect(recuperado.fase).toBe('reparto')
    expect(recuperado.ronda).toEqual(estado.ronda)
  })

  it('descarta una ronda inconsistente con los jugadores guardados', () => {
    const almacen = new AlmacenFalso()
    const estado = aplicar(conJugadores(['Ana', 'Luis', 'Sofi']), { tipo: 'repartir' })
    almacen.setItem(
      CLAVE_ALMACEN,
      JSON.stringify({ ...estado, jugadores: estado.jugadores.slice(0, 2) }),
    )
    const recuperado = cargarEstado(almacen)
    expect(recuperado.fase).toBe('inicio')
    expect(recuperado.ronda).toBeNull()
    expect(recuperado.jugadores).toHaveLength(2)
  })

  it('si no quedan categorías válidas vuelve a todas', () => {
    const almacen = new AlmacenFalso()
    almacen.setItem(
      CLAVE_ALMACEN,
      JSON.stringify({ ajustes: { categoriasActivas: ['nada'], numImpostores: 7 } }),
    )
    const recuperado = cargarEstado(almacen)
    expect(recuperado.ajustes.categoriasActivas).toEqual(ajustesIniciales.categoriasActivas)
    expect(recuperado.ajustes.numImpostores).toBe(1)
    expect(recuperado.ajustes.conPista).toBe(true)
  })
})

describe('categorías por región', () => {
  it('la categoría México viene activa solo en México', () => {
    expect(crearAjustesIniciales('MX').categoriasActivas).toContain('mexico')
    expect(crearAjustesIniciales('AR').categoriasActivas).not.toContain('mexico')
    expect(crearAjustesIniciales(undefined).categoriasActivas).not.toContain('mexico')
    expect(crearAjustesIniciales('AR').categoriasActivas).toContain('comida')
  })

  it('al pasar de la versión 1 se suma México a quien juega en México', () => {
    const almacen = new AlmacenFalso()
    const v1 = { ajustes: { numImpostores: 1, conPista: true, categoriasActivas: ['comida'] } }
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(v1))
    expect(cargarEstado(almacen, 'MX').ajustes.categoriasActivas).toEqual(['comida', 'mexico'])
    expect(cargarEstado(almacen, 'CL').ajustes.categoriasActivas).toEqual(['comida'])
  })

  it('respeta que el jugador haya apagado una categoría que ya conocía', () => {
    const almacen = new AlmacenFalso()
    const estado = aplicar(
      { ...estadoInicial, ajustes: crearAjustesIniciales('MX') },
      { tipo: 'toggleCategoria', id: 'mexico' },
    )
    guardarEstado(almacen, estado)
    const recuperado = cargarEstado(almacen, 'MX')
    expect(recuperado.ajustes.categoriasActivas).not.toContain('mexico')
    expect(recuperado.ajustes.categoriasConocidas).toContain('mexico')
  })
})

import { describe, expect, it } from 'vitest'
import { categorias, clavePalabra, palabrasDeCategoria } from '@/data/words'
import {
  acusacionesPermitidas,
  asignarRoles,
  barajar,
  crearRonda,
  elegirPalabra,
  impostoresDe,
  maxImpostores,
  ordenDeRonda,
  resolverVoto,
  validarPartida,
  type Rng,
} from './engine'
import type { Ajustes, Categoria, Jugador, Ronda } from './types'

function rngDeterminista(semilla = 1): Rng {
  // LCG sencillo; suficiente para pruebas reproducibles.
  let estado = semilla >>> 0
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 2 ** 32
  }
}

function jugadores(n: number): Jugador[] {
  return Array.from({ length: n }, (_, i) => ({ id: `j${i + 1}`, nombre: `Jugador ${i + 1}` }))
}

const ajustesBase: Ajustes = {
  numImpostores: 1,
  categoriasActivas: categorias.map((c) => c.id),
}

const mini: Categoria = {
  id: 'mini',
  nombre: 'Mini',
  emoji: 'x',
  grupos: [{ pista: 'Italia', palabras: ['Pizza', 'Lasaña'] }],
}

describe('barajar', () => {
  it('conserva los elementos y no muta el original', () => {
    const original = [1, 2, 3, 4, 5]
    const resultado = barajar(original, rngDeterminista())
    expect(resultado).toHaveLength(5)
    expect([...resultado].sort()).toEqual([1, 2, 3, 4, 5])
    expect(original).toEqual([1, 2, 3, 4, 5])
  })
})

describe('maxImpostores', () => {
  it('permite 2 impostores solo con 6 o más jugadores', () => {
    expect(maxImpostores(3)).toBe(1)
    expect(maxImpostores(5)).toBe(1)
    expect(maxImpostores(6)).toBe(2)
    expect(maxImpostores(15)).toBe(2)
  })
})

describe('elegirPalabra', () => {
  it('solo elige palabras de las categorías activas', () => {
    const rng = rngDeterminista(7)
    for (let i = 0; i < 50; i++) {
      const { palabra } = elegirPalabra(categorias, ['comida'], [], rng)
      expect(palabra.categoriaId).toBe('comida')
    }
  })

  it('no repite palabras hasta agotar la categoría y luego reinicia', () => {
    const rng = rngDeterminista(3)
    let usadas: string[] = []
    const vistas = new Set<string>()
    const primera = elegirPalabra([mini], ['mini'], usadas, rng)
    usadas = primera.usadas
    vistas.add(primera.palabra.texto)
    const segunda = elegirPalabra([mini], ['mini'], usadas, rng)
    usadas = segunda.usadas
    vistas.add(segunda.palabra.texto)
    expect(vistas.size).toBe(2)
    expect(segunda.reinicio).toBe(false)

    const tercera = elegirPalabra([mini], ['mini'], usadas, rng)
    expect(tercera.reinicio).toBe(true)
    expect(tercera.usadas).toEqual([clavePalabra(tercera.palabra)])
  })

  it('al reiniciar conserva las usadas de otras categorías', () => {
    const rng = rngDeterminista(5)
    const otra = clavePalabra({ categoriaId: 'comida', texto: 'Pizza' })
    const usadas = [otra, ...palabrasDeCategoria(mini).map(clavePalabra)]
    const eleccion = elegirPalabra([mini, ...categorias], ['mini'], usadas, rng)
    expect(eleccion.reinicio).toBe(true)
    expect(eleccion.usadas).toContain(otra)
  })

  it('cae en todas las categorías si ninguna activa existe', () => {
    const { palabra } = elegirPalabra(categorias, ['no-existe'], [], rngDeterminista())
    expect(palabra.texto.length).toBeGreaterThan(0)
  })

  it('cada palabra elegida trae su pista lejana y categoría', () => {
    const { palabra } = elegirPalabra(categorias, ['animales'], [], rngDeterminista(11))
    expect(palabra.pista.length).toBeGreaterThan(0)
    expect(palabra.categoriaNombre).toBe('Animales')
  })
})

describe('asignarRoles', () => {
  it('asigna exactamente el número de impostores pedido', () => {
    const roles = asignarRoles(jugadores(7), 2, rngDeterminista(2))
    const impostores = Object.values(roles).filter((r) => r === 'impostor')
    expect(impostores).toHaveLength(2)
    expect(Object.keys(roles)).toHaveLength(7)
  })

  it('nunca deja a todos como impostores', () => {
    const roles = asignarRoles(jugadores(3), 5, rngDeterminista(2))
    expect(Object.values(roles).filter((r) => r === 'civil').length).toBeGreaterThan(0)
  })

  it('reparte el rol de impostor de forma variada entre jugadores', () => {
    const rng = rngDeterminista(42)
    const conteo = new Map<string, number>()
    for (let i = 0; i < 300; i++) {
      const roles = asignarRoles(jugadores(4), 1, rng)
      const impostor = Object.entries(roles).find(([, r]) => r === 'impostor')![0]
      conteo.set(impostor, (conteo.get(impostor) ?? 0) + 1)
    }
    expect(conteo.size).toBe(4)
    for (const veces of conteo.values()) expect(veces).toBeGreaterThan(30)
  })
})

describe('ordenDeRonda', () => {
  it('respeta el orden de asientos a partir de un inicio aleatorio', () => {
    const lista = jugadores(5)
    const orden = ordenDeRonda(lista, () => 0.5)
    expect(orden).toEqual(['j3', 'j4', 'j5', 'j1', 'j2'])
  })

  it('devuelve vacío sin jugadores', () => {
    expect(ordenDeRonda([])).toEqual([])
  })
})

describe('crearRonda', () => {
  it('limita los impostores según el número de jugadores', () => {
    const { ronda } = crearRonda(
      jugadores(4),
      { ...ajustesBase, numImpostores: 2 },
      categorias,
      [],
      rngDeterminista(9),
    )
    expect(impostoresDe(ronda)).toHaveLength(1)
    expect(acusacionesPermitidas(ronda)).toBe(1)
    expect(ronda.vuelta).toBe(1)
    expect(ronda.acusaciones).toEqual([])
  })

  it('con 6 jugadores y 2 impostores crea 2 impostores', () => {
    const { ronda, usadas } = crearRonda(
      jugadores(6),
      { ...ajustesBase, numImpostores: 2 },
      categorias,
      [],
      rngDeterminista(9),
    )
    expect(impostoresDe(ronda)).toHaveLength(2)
    expect(usadas).toEqual([clavePalabra(ronda.palabra)])
  })
})

describe('resolverVoto', () => {
  const ronda: Ronda = {
    palabra: palabrasDeCategoria(mini)[0],
    roles: { j1: 'civil', j2: 'impostor', j3: 'civil', j4: 'impostor', j5: 'civil', j6: 'civil' },
    orden: ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'],
    acusaciones: [],
    vuelta: 1,
  }

  it('los civiles ganan solo si atrapan a todos los impostores', () => {
    expect(resolverVoto(ronda, ['j2', 'j4'])).toEqual({
      atrapados: ['j2', 'j4'],
      escapados: [],
      civilesAcusados: [],
      ganaronCiviles: true,
    })
  })

  it('un impostor libre significa derrota para los civiles', () => {
    const resultado = resolverVoto(ronda, ['j2', 'j1'])
    expect(resultado.atrapados).toEqual(['j2'])
    expect(resultado.escapados).toEqual(['j4'])
    expect(resultado.civilesAcusados).toEqual(['j1'])
    expect(resultado.ganaronCiviles).toBe(false)
  })

  it('usa las acusaciones de la ronda por defecto', () => {
    expect(resolverVoto({ ...ronda, acusaciones: ['j3'] }).ganaronCiviles).toBe(false)
  })
})

describe('validarPartida', () => {
  it('acepta una partida bien configurada', () => {
    expect(validarPartida(jugadores(4), ajustesBase)).toEqual({ valido: true, errores: [] })
  })

  it('rechaza pocos jugadores, nombres vacíos o repetidos', () => {
    const { errores } = validarPartida(
      [
        { id: 'a', nombre: 'Ana' },
        { id: 'b', nombre: ' ana ' },
      ],
      ajustesBase,
    )
    expect(errores).toContain('Se necesitan al menos 3 jugadores.')
    expect(errores).toContain('Hay nombres repetidos.')
    expect(validarPartida([...jugadores(3), { id: 'x', nombre: '  ' }], ajustesBase).errores).toContain(
      'Todos los jugadores necesitan un nombre.',
    )
  })

  it('rechaza 2 impostores con menos de 6 jugadores y cero categorías', () => {
    const { errores } = validarPartida(jugadores(5), {
      ...ajustesBase,
      numImpostores: 2,
      categoriasActivas: [],
    })
    expect(errores).toContain('Para 2 impostores se necesitan 6 jugadores o más.')
    expect(errores).toContain('Elige al menos una categoría.')
  })

  it('rechaza más de 15 jugadores', () => {
    expect(validarPartida(jugadores(16), ajustesBase).errores).toContain('Máximo 15 jugadores.')
  })
})

import type { Categoria } from '@/game/types'
import { animals } from './animales'
import { home } from './casa'
import { food } from './comida'
import { sports } from './deportes'
import { school } from './escuela'
import { holidays } from './fiestas'
import { fruitsVeggies } from './frutas-verduras'
import { places } from './lugares'
import { music } from './musica'
import { nature } from './naturaleza'
import { jobs } from './profesiones'
import { transport } from './transporte'
import { usa } from './usa'

/** Banco en inglés internacional: evita palabras que cambian entre EE. UU., Reino Unido y
 *  Australia (soccer sí; football, chips o cookie no). Mismas ids de categoría que el español. */
export const categoriasEn: Categoria[] = [
  animals,
  food,
  fruitsVeggies,
  home,
  school,
  jobs,
  sports,
  transport,
  places,
  nature,
  holidays,
  music,
  usa,
]

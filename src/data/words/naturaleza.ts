import type { Categoria } from '@/game/types'

export const naturaleza: Categoria = {
  id: 'naturaleza',
  nombre: 'Naturaleza y clima',
  emoji: '🌦️',
  grupos: [
    { pista: 'Botas', palabras: ['Lluvia', 'Tormenta', 'Granizo', 'Lodo'] },
    { pista: 'Bufanda', palabras: ['Nieve', 'Hielo', 'Invierno', 'Escarcha'] },
    { pista: 'Bloqueador', palabras: ['Sol', 'Calor', 'Verano', 'Sequía'] },
    { pista: 'Papalote', palabras: ['Viento', 'Brisa', 'Tornado', 'Huracán'] },
    { pista: 'Miedo', palabras: ['Trueno', 'Relámpago', 'Terremoto', 'Erupción'] },
    { pista: 'Foto', palabras: ['Arcoíris', 'Atardecer', 'Aurora boreal', 'Amanecer'] },
    { pista: 'Telescopio', palabras: ['Luna', 'Estrella', 'Cometa', 'Planeta', 'Eclipse'] },
    { pista: 'Ardilla', palabras: ['Árbol', 'Rama', 'Hoja', 'Bosque', 'Semilla', 'Otoño'] },
    { pista: 'Abeja', palabras: ['Flor', 'Primavera', 'Girasol', 'Rosa'] },
    { pista: 'Sirena', palabras: ['Mar', 'Océano', 'Ola', 'Isla'] },
    { pista: 'Rana', palabras: ['Río', 'Lago', 'Laguna', 'Cascada', 'Pantano'] },
    { pista: 'Camello', palabras: ['Desierto', 'Duna', 'Cactus', 'Oasis'] },
    { pista: 'Algodón', palabras: ['Nube', 'Niebla', 'Neblina'] },
    { pista: 'Alpinista', palabras: ['Montaña', 'Cerro', 'Volcán', 'Glaciar'] },
    { pista: 'Zapato', palabras: ['Piedra', 'Tierra', 'Arena', 'Polvo'] },
    { pista: 'Bombero', palabras: ['Fuego', 'Humo', 'Incendio', 'Ceniza'] },
    { pista: 'Noticias', palabras: ['Inundación', 'Tsunami', 'Deslave'] },
  ],
}

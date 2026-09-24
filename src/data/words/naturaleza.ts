import type { Categoria } from '@/game/types'

export const naturaleza: Categoria = {
  id: 'naturaleza',
  nombre: 'Naturaleza y clima',
  emoji: '🌦️',
  grupos: [
    { pista: 'Botas', palabras: ['Lluvia', 'Tormenta', 'Granizo', 'Lodo'] },
    { pista: 'Bufanda', palabras: ['Nieve', 'Hielo', 'Invierno', 'Escarcha'] },
    { pista: 'Abanico', palabras: ['Sol', 'Calor', 'Verano', 'Sequía'] },
    { pista: 'Molino', palabras: ['Viento', 'Brisa', 'Tornado', 'Huracán'] },
    { pista: 'Miedo', palabras: ['Trueno', 'Relámpago', 'Terremoto', 'Erupción'] },
    { pista: 'Foto', palabras: ['Arcoíris', 'Atardecer', 'Aurora boreal', 'Amanecer'] },
    { pista: 'Telescopio', palabras: ['Luna', 'Estrella', 'Cometa', 'Planeta', 'Eclipse'] },
    { pista: 'Ardilla', palabras: ['Árbol', 'Hoja', 'Bosque', 'Semilla', 'Otoño'] },
    { pista: 'Perfume', palabras: ['Primavera', 'Girasol', 'Rosa'] },
    { pista: 'Sirena', palabras: ['Mar', 'Ola', 'Isla'] },
    { pista: 'Rana', palabras: ['Río', 'Lago', 'Cascada', 'Pantano'] },
    { pista: 'Sed', palabras: ['Desierto', 'Duna', 'Cactus', 'Oasis'] },
    { pista: 'Algodón', palabras: ['Nube', 'Niebla'] },
    { pista: 'Alpinista', palabras: ['Montaña', 'Volcán', 'Glaciar'] },
    { pista: 'Zapato', palabras: ['Piedra', 'Tierra', 'Arena'] },
    { pista: 'Dragón', palabras: ['Fuego', 'Humo', 'Incendio', 'Ceniza'] },
    { pista: 'Noticias', palabras: ['Inundación', 'Tsunami', 'Derrumbe'] },
  ],
}

import type { Categoria } from '@/game/types'

export const usa: Categoria = {
  id: 'usa',
  nombre: 'USA',
  emoji: '🇺🇸',
  // Cultura de EE. UU.: activa por defecto solo si el dispositivo está en esa región.
  regiones: ['US'],
  grupos: [
    {
      pista: 'November',
      palabras: ['Thanksgiving', 'Black Friday', 'Pumpkin pie', 'Veterans Day'],
    },
    { pista: 'Barbecue', palabras: ['Fourth of July', 'Memorial Day', 'Labor Day'] },
    { pista: 'Stadium', palabras: ['Super Bowl', 'Touchdown', 'Cheerleader', 'Home run'] },
    { pista: 'Classroom', palabras: ['Pledge of Allegiance', 'Spelling bee', 'Show and tell'] },
    { pista: 'Diner', palabras: ['Mac and cheese', 'Milkshake', 'Meatloaf', 'Grilled cheese'] },
    { pista: 'New York', palabras: ['Times Square', 'Central Park', 'Yellow cab', 'Broadway'] },
    { pista: 'Hollywood', palabras: ['Walk of Fame', 'Oscars'] },
    { pista: 'Road trip', palabras: ['Grand Canyon', 'Route 66', 'Mount Rushmore', 'Yellowstone'] },
    { pista: 'Piggy bank', palabras: ['Quarter', 'Penny', 'Dime'] },
    { pista: 'Mall', palabras: ['Food court', 'Arcade'] },
    { pista: 'Limo', palabras: ['Prom', 'Homecoming'] },
  ],
}

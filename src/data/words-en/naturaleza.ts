import type { Categoria } from '@/game/types'

export const nature: Categoria = {
  id: 'naturaleza',
  nombre: 'Nature and weather',
  emoji: '🌦️',
  grupos: [
    { pista: 'Boots', palabras: ['Rain', 'Storm', 'Hail', 'Mud', 'Puddle'] },
    { pista: 'Scarf', palabras: ['Snow', 'Ice', 'Winter', 'Frost'] },
    { pista: 'Fan', palabras: ['Sun', 'Heat', 'Summer', 'Drought'] },
    { pista: 'Kite', palabras: ['Wind', 'Breeze', 'Tornado', 'Hurricane'] },
    { pista: 'Scared', palabras: ['Thunder', 'Lightning', 'Earthquake', 'Eruption'] },
    { pista: 'Camera', palabras: ['Rainbow', 'Sunset', 'Northern lights', 'Sunrise'] },
    { pista: 'Telescope', palabras: ['Moon', 'Star', 'Comet', 'Planet', 'Eclipse'] },
    { pista: 'Squirrel', palabras: ['Tree', 'Branch', 'Leaf', 'Acorn', 'Seed', 'Autumn'] },
    { pista: 'Perfume', palabras: ['Flower', 'Spring', 'Sunflower', 'Rose'] },
    { pista: 'Mermaid', palabras: ['Sea', 'Ocean', 'Wave', 'Island'] },
    { pista: 'Frog', palabras: ['River', 'Lake', 'Pond', 'Waterfall', 'Swamp'] },
    { pista: 'Thirst', palabras: ['Desert', 'Dune', 'Cactus', 'Oasis'] },
    { pista: 'Cotton', palabras: ['Cloud', 'Fog', 'Mist'] },
    { pista: 'Climber', palabras: ['Mountain', 'Hill', 'Volcano', 'Glacier'] },
    { pista: 'Shoe', palabras: ['Stone', 'Sand', 'Dust', 'Pebble'] },
    { pista: 'Hose', palabras: ['Fire', 'Smoke', 'Wildfire', 'Ash'] },
    { pista: 'News', palabras: ['Flood', 'Tsunami', 'Landslide'] },
  ],
}

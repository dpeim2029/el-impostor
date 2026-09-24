import type { Categoria } from '@/game/types'

export const celebrations: Categoria = {
  id: 'fiestas',
  nombre: 'Celebrations',
  emoji: '🎉',
  grupos: [
    { pista: 'Chimney', palabras: ['Christmas', 'Santa Claus', 'Reindeer', 'Presents'] },
    {
      pista: 'December',
      palabras: ['Tinsel', 'Carols', 'Advent calendar', 'Stocking', 'Hanukkah'],
    },
    { pista: 'Staying up late', palabras: ["New Year's Eve", 'Fireworks', 'Confetti'] },
    { pista: 'Photographer', palabras: ['Wedding', 'Graduation', 'Anniversary'] },
    {
      pista: 'Invitation',
      palabras: ['Birthday', 'Balloons', 'Party hat', 'Sleepover', 'Baby shower'],
    },
    { pista: 'Basket', palabras: ['Easter', 'Egg hunt'] },
    { pista: 'October', palabras: ['Halloween', 'Costume', 'Trick or treat'] },
    { pista: 'Card', palabras: ["Mother's Day", "Father's Day", "Valentine's Day"] },
    { pista: 'Parade', palabras: ['Carnival', "Saint Patrick's Day"] },
    { pista: 'Mexico', palabras: ['Day of the Dead', 'Piñata'] },
    { pista: 'Lanterns', palabras: ['Chinese New Year', 'Diwali'] },
    { pista: 'Bride', palabras: ['Engagement', 'Honeymoon'] },
  ],
}

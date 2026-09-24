import type { Categoria } from '@/game/types'

export const holidays: Categoria = {
  id: 'fiestas',
  nombre: 'Holidays and traditions',
  emoji: '🎉',
  grupos: [
    { pista: 'Chimney', palabras: ['Christmas', 'Santa Claus', 'Christmas Eve', 'Presents'] },
    {
      pista: 'December',
      palabras: ['Christmas tree', 'Carols', 'Advent calendar', 'Secret Santa'],
    },
    { pista: 'Midnight', palabras: ["New Year's Eve", 'Fireworks', 'Confetti'] },
    { pista: 'Photographer', palabras: ['Wedding', 'Graduation', 'Anniversary'] },
    { pista: 'Invitation', palabras: ['Birthday', 'Balloons', 'Party hat', 'Sleepover'] },
    { pista: 'Basket', palabras: ['Easter', 'Egg hunt'] },
    { pista: 'October', palabras: ['Halloween', 'Costume', 'Trick or treat'] },
    { pista: 'Card', palabras: ["Mother's Day", "Father's Day", "Valentine's Day"] },
    { pista: 'Stork', palabras: ['Baby shower', 'Gender reveal'] },
    { pista: 'Parade', palabras: ['Carnival', 'Float'] },
    { pista: 'Mexico', palabras: ['Day of the Dead', 'Piñata'] },
    { pista: 'Lanterns', palabras: ['Chinese New Year', 'Diwali', 'Hanukkah'] },
    { pista: 'Ring', palabras: ['Engagement', 'Honeymoon'] },
  ],
}

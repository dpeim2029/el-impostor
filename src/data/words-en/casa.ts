import type { Categoria } from '@/game/types'

export const home: Categoria = {
  id: 'casa',
  nombre: 'Things at home',
  emoji: '🏠',
  grupos: [
    { pista: 'Chef', palabras: ['Frying pan', 'Pot', 'Blender', 'Knife', 'Oven'] },
    {
      pista: 'Electrician',
      palabras: ['Fridge', 'Microwave', 'Washing machine', 'Lamp', 'Fan', 'Iron'],
    },
    { pista: 'Hotel', palabras: ['Bed', 'Pillow', 'Blanket', 'Towel', 'Soap'] },
    { pista: 'Leak', palabras: ['Shower', 'Sink', 'Toilet', 'Pipe'] },
    { pista: 'Morning', palabras: ['Toothbrush', 'Comb', 'Mirror', 'Shampoo'] },
    { pista: 'Guests', palabras: ['Sofa', 'Armchair', 'Rug', 'Curtain'] },
    {
      pista: 'Restaurant',
      palabras: ['Plate', 'Glass', 'Spoon', 'Fork', 'Napkin', 'Table', 'Chair'],
    },
    { pista: 'Cinderella', palabras: ['Broom', 'Bucket', 'Mop'] },
    { pista: 'Homework', palabras: ['Desk', 'Computer', 'Printer'] },
    { pista: 'Delivery', palabras: ['Doorbell', 'Doormat'] },
    { pista: 'Burglar', palabras: ['Window', 'Key', 'Lock', 'Door'] },
    { pista: 'Hammer', palabras: ['Clock', 'Painting', 'Calendar', 'Shelf'] },
    { pista: 'Gardener', palabras: ['Watering can', 'Hose', 'Flowerpot'] },
    { pista: 'Stork', palabras: ['Baby bottle', 'Rattle', 'Bib'] },
    { pista: 'Weekend', palabras: ['TV', 'Remote control', 'Game console'] },
  ],
}

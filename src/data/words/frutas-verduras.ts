import type { Categoria } from '@/game/types'

export const frutasVerduras: Categoria = {
  id: 'frutas-verduras',
  nombre: 'Frutas y verduras',
  emoji: '🍓',
  grupos: [
    { pista: 'Batido', palabras: ['Plátano', 'Fresa', 'Mango', 'Papaya'] },
    { pista: 'Hawái', palabras: ['Piña', 'Coco'] },
    { pista: 'Mermelada', palabras: ['Mora', 'Frambuesa', 'Arándano'] },
    { pista: 'Resfriado', palabras: ['Naranja', 'Mandarina', 'Kiwi', 'Guayaba'] },
    { pista: 'Ceviche', palabras: ['Limón', 'Cebolla', 'Cilantro'] },
    { pista: 'Cuento', palabras: ['Manzana', 'Calabaza'] },
    { pista: 'Hámster', palabras: ['Lechuga', 'Zanahoria'] },
    { pista: 'Ensalada', palabras: ['Tomate', 'Pepino', 'Espinaca', 'Rábano'] },
    { pista: 'Caldo', palabras: ['Papa', 'Maíz', 'Apio'] },
    { pista: 'Mortero', palabras: ['Ajo', 'Jengibre'] },
    { pista: 'Verano', palabras: ['Sandía', 'Melón'] },
    { pista: 'Año Nuevo', palabras: ['Uva', 'Lenteja'] },
    { pista: 'Huerta', palabras: ['Pera', 'Cereza', 'Ciruela', 'Higo'] },
    { pista: 'Berrinche', palabras: ['Brócoli', 'Coliflor', 'Remolacha'] },
    { pista: 'Desierto', palabras: ['Dátil', 'Pitaya'] },
  ],
}

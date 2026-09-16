import type { Categoria } from '@/game/types'

export const frutasVerduras: Categoria = {
  id: 'frutas-verduras',
  nombre: 'Frutas y verduras',
  emoji: '🍓',
  grupos: [
    { pista: 'Licuado', palabras: ['Plátano', 'Fresa', 'Mango', 'Papaya'] },
    { pista: 'Hawái', palabras: ['Piña', 'Coco'] },
    { pista: 'Mermelada', palabras: ['Zarzamora', 'Chabacano', 'Durazno'] },
    { pista: 'Gripa', palabras: ['Naranja', 'Mandarina', 'Toronja', 'Guayaba'] },
    {
      pista: 'Taquería',
      palabras: ['Limón', 'Cebolla', 'Cilantro', 'Rábano', 'Aguacate'],
    },
    { pista: 'Cuento', palabras: ['Manzana', 'Calabaza', 'Chícharo'] },
    { pista: 'Conejo', palabras: ['Lechuga', 'Zanahoria', 'Apio'] },
    { pista: 'Ensalada', palabras: ['Jitomate', 'Pepino', 'Espinaca'] },
    { pista: 'Caldo', palabras: ['Papa', 'Chayote', 'Calabacita', 'Ejote'] },
    { pista: 'Molcajete', palabras: ['Chile', 'Tomate verde', 'Ajo'] },
    { pista: 'Posada', palabras: ['Tejocote', 'Cacahuate', 'Caña', 'Jícama'] },
    { pista: 'Verano', palabras: ['Sandía', 'Melón'] },
    { pista: 'Año Nuevo', palabras: ['Uva', 'Lenteja'] },
    { pista: 'Huerta', palabras: ['Pera', 'Cereza', 'Ciruela', 'Higo'] },
    { pista: 'Berrinche', palabras: ['Brócoli', 'Coliflor', 'Betabel'] },
    { pista: 'Desierto', palabras: ['Nopal', 'Tuna', 'Pitaya'] },
  ],
}

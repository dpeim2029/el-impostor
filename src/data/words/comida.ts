import type { Categoria } from '@/game/types'

export const comida: Categoria = {
  id: 'comida',
  nombre: 'Comida',
  emoji: '🌮',
  grupos: [
    { pista: 'Italia', palabras: ['Pizza', 'Espagueti', 'Lasaña'] },
    { pista: 'Japón', palabras: ['Sushi', 'Ramen'] },
    { pista: 'Estados Unidos', palabras: ['Hamburguesa', 'Hot dog'] },
    { pista: 'Cine', palabras: ['Palomitas', 'Nachos'] },
    {
      pista: 'Abuelita',
      palabras: ['Mole', 'Pozole', 'Tamales', 'Enchiladas', 'Sopes'],
    },
    { pista: 'Puesto', palabras: ['Tacos', 'Elote', 'Esquites', 'Churros'] },
    { pista: 'Domingo', palabras: ['Hot cakes', 'Chilaquiles', 'Barbacoa'] },
    { pista: 'Cumpleaños', palabras: ['Pastel', 'Gelatina'] },
    { pista: 'Playa', palabras: ['Ceviche', 'Camarones', 'Pescado'] },
    { pista: 'Verano', palabras: ['Helado', 'Paleta de hielo', 'Raspado'] },
    { pista: 'Oaxaca', palabras: ['Tlayuda', 'Chapulines'] },
    { pista: 'Vaca', palabras: ['Queso', 'Yogurt', 'Mantequilla'] },
    { pista: 'Panadero', palabras: ['Concha', 'Bolillo', 'Galletas', 'Dona'] },
    { pista: 'Enfermo', palabras: ['Caldo de pollo', 'Sopa de fideo'] },
    {
      pista: 'Dentista',
      palabras: ['Chocolate', 'Chicle', 'Algodón de azúcar', 'Paleta de caramelo'],
    },
    { pista: 'Lonchera', palabras: ['Sándwich', 'Quesadilla', 'Torta'] },
    { pista: 'Fonda', palabras: ['Arroz', 'Frijoles', 'Milanesa'] },
  ],
}

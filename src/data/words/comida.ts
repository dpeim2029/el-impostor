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
    { pista: 'Abuelita', palabras: ['Arroz con leche', 'Flan'] },
    { pista: 'Puesto', palabras: ['Tacos', 'Churros', 'Empanadas', 'Arepas'] },
    { pista: 'Domingo', palabras: ['Panqueques', 'Asado', 'Paella'] },
    { pista: 'Playa', palabras: ['Ceviche', 'Camarones', 'Pescado'] },
    { pista: 'Verano', palabras: ['Helado', 'Limonada', 'Granizado'] },
    { pista: 'Vaca', palabras: ['Queso', 'Yogur', 'Mantequilla'] },
    { pista: 'Panadero', palabras: ['Galletas', 'Dona', 'Croissant', 'Pan dulce', 'Pastel'] },
    { pista: 'Enfermo', palabras: ['Caldo de pollo', 'Sopa de fideos', 'Gelatina'] },
    { pista: 'Dentista', palabras: ['Chocolate', 'Chicle', 'Algodón de azúcar', 'Caramelo'] },
    { pista: 'Recreo', palabras: ['Sándwich', 'Jugo'] },
    { pista: 'Almuerzo', palabras: ['Arroz', 'Puré', 'Milanesa'] },
  ],
}

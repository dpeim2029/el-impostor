import type { Categoria } from '@/game/types'

export const food: Categoria = {
  id: 'comida',
  nombre: 'Food',
  emoji: '🍔',
  grupos: [
    { pista: 'Italy', palabras: ['Pizza', 'Spaghetti', 'Ravioli'] },
    { pista: 'Japan', palabras: ['Sushi', 'Ramen'] },
    { pista: 'Mexico', palabras: ['Tacos', 'Burrito', 'Guacamole', 'Quesadilla'] },
    { pista: 'Cinema', palabras: ['Popcorn', 'Nachos'] },
    { pista: 'Grandma', palabras: ['Apple pie', 'Stew', 'Roast chicken'] },
    { pista: 'Weekend', palabras: ['Pancakes', 'Waffles', 'Bacon', 'Eggs'] },
    { pista: 'Seaside', palabras: ['Fish', 'Crab', 'Lobster'] },
    { pista: 'Summer', palabras: ['Ice cream', 'Lemonade'] },
    { pista: 'Cow', palabras: ['Cheese', 'Butter', 'Milk'] },
    { pista: 'Baker', palabras: ['Bread', 'Doughnut', 'Muffin', 'Bagel', 'Cake'] },
    { pista: 'Paris', palabras: ['Crêpes', 'Baguette', 'Croissant'] },
    { pista: 'Sick day', palabras: ['Chicken soup', 'Toast'] },
    { pista: 'Dentist', palabras: ['Chocolate', 'Chewing gum', 'Lollipop'] },
    { pista: 'Lunchbox', palabras: ['Sandwich', 'Wrap', 'Juice'] },
    { pista: 'Barbecue', palabras: ['Hamburger', 'Hot dog', 'Ribs', 'Steak'] },
    { pista: 'China', palabras: ['Dumplings', 'Fried rice', 'Spring rolls'] },
  ],
}

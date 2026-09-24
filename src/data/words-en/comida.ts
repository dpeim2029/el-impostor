import type { Categoria } from '@/game/types'

export const food: Categoria = {
  id: 'comida',
  nombre: 'Food',
  emoji: '🍔',
  grupos: [
    { pista: 'Italy', palabras: ['Pizza', 'Spaghetti', 'Lasagna'] },
    { pista: 'Japan', palabras: ['Sushi', 'Ramen'] },
    { pista: 'Mexico', palabras: ['Tacos', 'Burrito', 'Guacamole', 'Quesadilla'] },
    { pista: 'Cinema', palabras: ['Popcorn', 'Nachos'] },
    { pista: 'Grandma', palabras: ['Apple pie', 'Stew', 'Roast chicken'] },
    { pista: 'Sunday', palabras: ['Pancakes', 'Waffles', 'Bacon', 'Eggs'] },
    { pista: 'Birthday', palabras: ['Cake', 'Cupcake'] },
    { pista: 'Seaside', palabras: ['Fish', 'Crab', 'Lobster'] },
    { pista: 'Summer', palabras: ['Ice cream', 'Lemonade'] },
    { pista: 'Cow', palabras: ['Cheese', 'Yogurt', 'Butter', 'Milk'] },
    { pista: 'Baker', palabras: ['Bread', 'Donut', 'Muffin', 'Bagel'] },
    { pista: 'Paris', palabras: ['Crêpes', 'Baguette', 'Croissant'] },
    { pista: 'Sick day', palabras: ['Chicken soup', 'Toast'] },
    { pista: 'Dentist', palabras: ['Chocolate', 'Chewing gum', 'Lollipop'] },
    { pista: 'Lunchbox', palabras: ['Sandwich', 'Wrap', 'Juice'] },
    { pista: 'Barbecue', palabras: ['Hamburger', 'Hot dog', 'Ribs', 'Sausage'] },
    { pista: 'China', palabras: ['Dumplings', 'Fried rice', 'Spring rolls'] },
  ],
}

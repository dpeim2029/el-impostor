import type { Categoria } from '@/game/types'

export const fruitsVeggies: Categoria = {
  id: 'frutas-verduras',
  nombre: 'Fruits and veggies',
  emoji: '🍓',
  grupos: [
    { pista: 'Smoothie', palabras: ['Banana', 'Strawberry', 'Mango', 'Blueberry'] },
    { pista: 'Hawaii', palabras: ['Pineapple', 'Coconut'] },
    { pista: 'Jam', palabras: ['Raspberry', 'Blackberry', 'Apricot'] },
    { pista: 'Flu season', palabras: ['Orange', 'Grapefruit', 'Lemon'] },
    { pista: 'Fairy tale', palabras: ['Apple', 'Pumpkin', 'Beans'] },
    { pista: 'Hamster', palabras: ['Lettuce', 'Carrot', 'Celery'] },
    { pista: 'Salad', palabras: ['Tomato', 'Cucumber', 'Spinach', 'Radish'] },
    { pista: 'Soup', palabras: ['Potato', 'Onion', 'Peas'] },
    { pista: 'Pizza', palabras: ['Mushroom', 'Olive'] },
    { pista: 'Summer', palabras: ['Watermelon', 'Peach'] },
    { pista: 'Orchard', palabras: ['Cherry', 'Plum', 'Pear'] },
    { pista: 'Tantrum', palabras: ['Broccoli', 'Cauliflower', 'Brussels sprouts'] },
    { pista: 'Caribbean', palabras: ['Papaya', 'Passion fruit', 'Guava'] },
  ],
}

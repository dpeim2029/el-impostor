import type { Categoria } from '@/game/types'

export const animals: Categoria = {
  id: 'animales',
  nombre: 'Animals',
  emoji: '🦁',
  grupos: [
    { pista: 'Safari', palabras: ['Lion', 'Elephant', 'Giraffe', 'Zebra', 'Hippo', 'Rhino'] },
    { pista: 'Rainforest', palabras: ['Monkey', 'Snake', 'Parrot', 'Crocodile', 'Gorilla'] },
    {
      pista: 'Farm',
      palabras: ['Cow', 'Horse', 'Chicken', 'Pig', 'Sheep', 'Donkey', 'Goat', 'Duck'],
    },
    { pista: 'Vet', palabras: ['Dog', 'Cat', 'Hamster', 'Rabbit', 'Guinea pig'] },
    { pista: 'Diver', palabras: ['Shark', 'Dolphin', 'Octopus', 'Whale', 'Turtle', 'Jellyfish'] },
    { pista: 'Halloween', palabras: ['Bat', 'Owl', 'Spider'] },
    { pista: 'Forest', palabras: ['Wolf', 'Bear', 'Fox', 'Deer', 'Squirrel'] },
    { pista: 'Garden', palabras: ['Butterfly', 'Bee', 'Snail', 'Ant', 'Worm'] },
    { pista: 'Iceberg', palabras: ['Penguin', 'Polar bear', 'Seal'] },
  ],
}

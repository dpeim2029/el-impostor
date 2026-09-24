import type { Categoria } from '@/game/types'

export const school: Categoria = {
  id: 'escuela',
  nombre: 'School',
  emoji: '🎒',
  grupos: [
    {
      pista: 'Desk',
      palabras: [
        'Notebook',
        'Pencil',
        'Pen',
        'Eraser',
        'Sharpener',
        'Ruler',
        'Scissors',
        'Glue',
        'Crayons',
      ],
    },
    { pista: 'Lunchtime', palabras: ['Hopscotch', 'Swing', 'Slide'] },
    { pista: 'First day', palabras: ['Uniform', 'Backpack'] },
    { pista: 'Gold star', palabras: ['Exam', 'Homework'] },
    { pista: 'Teacher', palabras: ['Whiteboard', 'Chalk', 'Marker'] },
    { pista: 'Library', palabras: ['Bookmark', 'Dictionary', 'Atlas'] },
    { pista: 'Laboratory', palabras: ['Microscope', 'Goggles', 'Magnifying glass', 'Test tube'] },
    { pista: 'Times tables', palabras: ['Calculator', 'Abacus'] },
    { pista: 'Talent show', palabras: ['Stage', 'Spotlight', 'Microphone'] },
    { pista: 'Coach', palabras: ['Ball', 'Whistle', 'Cone', 'Gym'] },
    { pista: 'Artist', palabras: ['Paintbrush', 'Clay', 'Easel', 'Palette'] },
    { pista: 'Internet', palabras: ['Keyboard', 'Mouse', 'Tablet', 'Projector'] },
  ],
}

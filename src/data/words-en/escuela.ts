import type { Categoria } from '@/game/types'

export const school: Categoria = {
  id: 'escuela',
  nombre: 'School',
  emoji: '🎒',
  grupos: [
    {
      pista: 'Back to school',
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
    { pista: 'Lunchtime', palabras: ['Playground', 'Swing', 'Slide'] },
    { pista: 'Monday', palabras: ['Uniform', 'Backpack'] },
    { pista: 'Report card', palabras: ['Exam', 'Quiz', 'Homework'] },
    { pista: 'Teacher', palabras: ['Whiteboard', 'Chalk', 'Marker'] },
    { pista: 'Library', palabras: ['Book', 'Dictionary', 'Encyclopedia', 'Atlas'] },
    { pista: 'Laboratory', palabras: ['Microscope', 'Lab coat', 'Magnifying glass', 'Test tube'] },
    { pista: 'Engineer', palabras: ['Calculator', 'Compass', 'Protractor'] },
    { pista: 'School play', palabras: ['Stage', 'Costume', 'Microphone'] },
    { pista: 'Coach', palabras: ['Ball', 'Whistle', 'Cone', 'Gym'] },
    { pista: 'Museum', palabras: ['Paintbrush', 'Clay', 'Easel', 'Paint'] },
    { pista: 'Internet', palabras: ['Keyboard', 'Mouse', 'Tablet', 'Projector'] },
  ],
}

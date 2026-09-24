import type { Categoria } from '@/game/types'

export const fiestas: Categoria = {
  id: 'fiestas',
  nombre: 'Fiestas y tradiciones',
  emoji: '🎉',
  grupos: [
    { pista: 'Chimenea', palabras: ['Navidad', 'Santa Claus', 'Nochebuena', 'Regalos'] },
    {
      pista: 'Diciembre',
      palabras: [
        'Nacimiento',
        'Árbol de Navidad',
        'Villancicos',
        'Amigo secreto',
        'Uvas de la suerte',
      ],
    },
    { pista: 'Enero', palabras: ['Año Nuevo', 'Día de Reyes', 'Rosca de Reyes'] },
    { pista: 'Chispas', palabras: ['Fuegos artificiales', 'Luces de bengala'] },
    { pista: 'Plaza', palabras: ['Desfile', 'Carnaval', 'Fiesta patronal'] },
    {
      pista: 'Fotógrafo',
      palabras: ['Fiesta de quince', 'Graduación', 'Bautizo', 'Primera comunión'],
    },
    { pista: 'Invitación', palabras: ['Cumpleaños', 'Piñata', 'Globos', 'Serpentinas'] },
    { pista: 'Canasta', palabras: ['Pascua', 'Huevos de Pascua'] },
    { pista: 'Carretera', palabras: ['Semana Santa', 'Fin de semana largo'] },
    { pista: 'Octubre', palabras: ['Halloween', 'Disfraz', 'Dulce o truco'] },
    {
      pista: 'Tarjeta',
      palabras: ['Día de la Madre', 'Día del Maestro', 'Aniversario', 'San Valentín'],
    },
    { pista: 'Juguetería', palabras: ['Día del Niño', 'Baby shower'] },
    { pista: 'Corbata', palabras: ['Día del Padre', 'Boda'] },
  ],
}

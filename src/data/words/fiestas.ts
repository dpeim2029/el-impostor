import type { Categoria } from '@/game/types'

export const fiestas: Categoria = {
  id: 'fiestas',
  nombre: 'Fiestas y tradiciones',
  emoji: '🎉',
  grupos: [
    { pista: 'Coco', palabras: ['Día de Muertos', 'Altar', 'Catrina'] },
    { pista: 'Chimenea', palabras: ['Navidad', 'Santa Claus', 'Nochebuena', 'Regalos'] },
    {
      pista: 'Diciembre',
      palabras: ['Nacimiento', 'Árbol de Navidad', 'Villancicos', 'Amigo secreto'],
    },
    {
      pista: 'Enero',
      palabras: ['Año Nuevo', 'Día de Reyes', 'Reyes Magos', 'Uvas de la suerte', 'Rosca de Reyes'],
    },
    { pista: 'Chispas', palabras: ['Fuegos artificiales', 'Luces de bengala'] },
    { pista: 'Plaza', palabras: ['Desfile', 'Mariachi', 'Carnaval'] },
    { pista: 'Fotógrafo', palabras: ['Quinceañera', 'Graduación', 'Bautizo', 'Primera comunión'] },
    { pista: 'Invitación', palabras: ['Cumpleaños', 'Piñata', 'Globos', 'Serpentinas'] },
    { pista: 'Canasta', palabras: ['Pascua', 'Huevos de Pascua'] },
    { pista: 'Playa', palabras: ['Semana Santa', 'Puente'] },
    { pista: 'Octubre', palabras: ['Halloween', 'Disfraz', 'Calabaza', 'Dulce o truco'] },
    {
      pista: 'Tarjeta',
      palabras: ['Día de la Madre', 'Día del Maestro', 'Aniversario', 'San Valentín'],
    },
    { pista: 'Juguetería', palabras: ['Día del Niño', 'Baby shower'] },
    { pista: 'Corbata', palabras: ['Día del Padre', 'Boda'] },
  ],
}

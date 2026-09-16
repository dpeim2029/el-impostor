import type { Categoria } from '@/game/types'

export const fiestas: Categoria = {
  id: 'fiestas',
  nombre: 'Fiestas y tradiciones',
  emoji: '🎉',
  grupos: [
    {
      pista: 'Coco',
      palabras: [
        'Día de Muertos',
        'Altar',
        'Cempasúchil',
        'Pan de muerto',
        'Alebrije',
        'Catrina',
        'Calaverita',
      ],
    },
    { pista: 'Chimenea', palabras: ['Navidad', 'Santa Claus', 'Nochebuena', 'Regalos'] },
    { pista: 'Vela', palabras: ['Posadas', 'Villancicos', 'Ponche', 'Luces de bengala'] },
    { pista: 'Enero', palabras: ['Año Nuevo', 'Día de Reyes', 'Reyes Magos', 'Uvas de la suerte'] },
    { pista: 'Muñequito', palabras: ['Rosca de Reyes', 'Día de la Candelaria', 'Tamales'] },
    {
      pista: 'Zócalo',
      palabras: [
        'Grito de Independencia',
        'Desfile',
        'Noche mexicana',
        'Fuegos artificiales',
        'Mariachi',
      ],
    },
    { pista: 'Febrero', palabras: ['Día del Amor y la Amistad', 'Día de la Bandera', 'Carnaval'] },
    { pista: 'Fotógrafo', palabras: ['Quinceañera', 'Graduación', 'Bautizo', 'Primera comunión'] },
    { pista: 'Mordida', palabras: ['Cumpleaños', 'Piñata', 'Globos', 'Las Mañanitas'] },
    { pista: 'Conejo', palabras: ['Pascua', 'Huevos de Pascua'] },
    { pista: 'Playa', palabras: ['Semana Santa', 'Puente'] },
    { pista: 'Bruja', palabras: ['Halloween', 'Disfraz', 'Calabaza', 'Dulce o truco'] },
    { pista: 'Serenata', palabras: ['Día de las Madres', 'Día del Maestro', 'Aniversario'] },
    { pista: 'Juguetería', palabras: ['Día del Niño', 'Baby shower'] },
    { pista: 'Corbata', palabras: ['Día del Padre', 'Boda'] },
    {
      pista: 'Diciembre',
      palabras: [
        'Día de la Virgen de Guadalupe',
        'Nacimiento',
        'Árbol de Navidad',
        'Esferas',
        'Intercambio',
      ],
    },
    { pista: 'Noviembre', palabras: ['Día de la Revolución', 'Buen Fin'] },
    { pista: 'Confeti', palabras: ['Cascarones', 'Serpentinas', 'Espantasuegras'] },
  ],
}

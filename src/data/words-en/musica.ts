import type { Categoria } from '@/game/types'

export const music: Categoria = {
  id: 'musica',
  nombre: 'Instruments and music',
  emoji: '🎸',
  grupos: [
    { pista: 'Campfire', palabras: ['Guitar', 'Ukulele', 'Harmonica'] },
    {
      pista: 'Preschool',
      palabras: ['Xylophone', 'Triangle', 'Tambourine', 'Maracas', 'Recorder', 'Bells'],
    },
    { pista: 'Wedding', palabras: ['Organ', 'Choir', 'Harp'] },
    { pista: 'Beethoven', palabras: ['Piano', 'Orchestra', 'Symphony', 'Sheet music'] },
    {
      pista: 'Parade',
      palabras: ['Drum', 'Tuba', 'Trombone', 'Clarinet', 'Cymbals', 'Trumpet', 'Saxophone'],
    },
    { pista: 'Earplugs', palabras: ['Drum kit', 'Electric guitar', 'Bass', 'Amplifier'] },
    { pista: 'Street', palabras: ['Accordion', 'Violin'] },
    { pista: 'Radio', palabras: ['Rock', 'Pop', 'Rap', 'Jazz'] },
    { pista: 'Dance floor', palabras: ['Salsa', 'Disco', 'Waltz', 'Tango'] },
    { pista: 'Tropical', palabras: ['Marimba', 'Bongos', 'Steel drum', 'Congas'] },
    { pista: 'Seville', palabras: ['Castanets', 'Flamenco'] },
    { pista: 'Shower', palabras: ['Karaoke', 'Song'] },
    { pista: 'Smartphone', palabras: ['Headphones', 'Speaker', 'Playlist'] },
    { pista: 'Stage', palabras: ['Opera', 'Ballet', 'Musical', 'Conductor'] },
    { pista: 'Grandma', palabras: ['Lullaby', 'Record player', 'Jukebox'] },
    { pista: 'Flag', palabras: ['National anthem', 'Marching band'] },
  ],
}

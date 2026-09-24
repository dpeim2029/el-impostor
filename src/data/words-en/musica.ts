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
    { pista: 'Beethoven', palabras: ['Piano', 'Orchestra', 'Cello', 'Sheet music'] },
    {
      pista: 'Parade',
      palabras: ['Tuba', 'Trombone', 'Clarinet', 'Cymbals', 'Trumpet', 'Saxophone'],
    },
    { pista: 'Earplugs', palabras: ['Drum kit', 'Bass', 'Amplifier'] },
    { pista: 'Street', palabras: ['Accordion', 'Violin'] },
    { pista: 'Radio', palabras: ['Rock', 'Pop', 'Rap', 'Jazz'] },
    { pista: 'Dance floor', palabras: ['Salsa', 'Disco', 'Waltz', 'Tango', 'Samba'] },
    { pista: 'Tropical', palabras: ['Marimba', 'Bongos', 'Steel drum'] },
    { pista: 'Spain', palabras: ['Castanets', 'Flamenco'] },
    { pista: 'Shower', palabras: ['Karaoke', 'Song'] },
    { pista: 'Smartphone', palabras: ['Headphones', 'Speaker', 'Playlist'] },
    { pista: 'Stage', palabras: ['Opera', 'Ballet', 'Musical', 'Conductor'] },
    { pista: 'Grandma', palabras: ['Lullaby', 'Record player', 'Jukebox'] },
    { pista: 'Flag', palabras: ['National anthem', 'Marching band'] },
  ],
}

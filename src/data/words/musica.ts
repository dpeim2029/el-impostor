import type { Categoria } from '@/game/types'

export const musica: Categoria = {
  id: 'musica',
  nombre: 'Instrumentos y música',
  emoji: '🎸',
  grupos: [
    { pista: 'Mariachi', palabras: ['Trompeta', 'Violín'] },
    { pista: 'Fogata', palabras: ['Guitarra', 'Ukulele', 'Armónica'] },
    {
      pista: 'Preescolar',
      palabras: ['Xilófono', 'Triángulo', 'Pandero', 'Maracas', 'Cascabeles', 'Flauta'],
    },
    { pista: 'Boda', palabras: ['Órgano', 'Coro', 'Arpa'] },
    { pista: 'Beethoven', palabras: ['Piano', 'Orquesta', 'Partitura', 'Sinfonía'] },
    {
      pista: 'Desfile',
      palabras: ['Tambor', 'Tuba', 'Trombón', 'Clarinete', 'Platillos', 'Corneta', 'Saxofón'],
    },
    { pista: 'Tapones', palabras: ['Batería', 'Guitarra eléctrica', 'Bajo', 'Amplificador'] },
    { pista: 'Calle', palabras: ['Acordeón', 'Organillo'] },
    { pista: 'Quinceañera', palabras: ['Cumbia', 'Salsa', 'Reggaetón', 'Vals'] },
    { pista: 'Radio', palabras: ['Rock', 'Pop', 'Rap', 'Balada'] },
    { pista: 'Tropical', palabras: ['Marimba', 'Bongó', 'Güiro', 'Congas'] },
    { pista: 'Sevilla', palabras: ['Castañuelas', 'Flamenco'] },
    { pista: 'Ducha', palabras: ['Karaoke', 'Canción'] },
    { pista: 'Celular', palabras: ['Audífonos', 'Altavoz', 'Playlist'] },
    { pista: 'Teatro', palabras: ['Ópera', 'Ballet', 'Director de orquesta'] },
    { pista: 'Abuelita', palabras: ['Bolero', 'Tango', 'Villancico'] },
    { pista: 'Bandera', palabras: ['Himno Nacional', 'Banda marcial'] },
  ],
}

import type { Categoria } from '@/game/types'

export const musica: Categoria = {
  id: 'musica',
  nombre: 'Instrumentos y música',
  emoji: '🎸',
  grupos: [
    { pista: 'Mariachi', palabras: ['Guitarrón', 'Vihuela', 'Trompeta', 'Violín'] },
    { pista: 'Fogata', palabras: ['Guitarra', 'Ukulele', 'Armónica'] },
    {
      pista: 'Kínder',
      palabras: ['Xilófono', 'Triángulo', 'Pandero', 'Maracas', 'Cascabeles', 'Flauta'],
    },
    { pista: 'Boda', palabras: ['Órgano', 'Coro', 'Arpa'] },
    { pista: 'Beethoven', palabras: ['Piano', 'Orquesta', 'Partitura', 'Sinfonía'] },
    {
      pista: 'Desfile',
      palabras: ['Tambor', 'Tuba', 'Trombón', 'Clarinete', 'Platillos', 'Corneta', 'Saxofón'],
    },
    { pista: 'Tapones', palabras: ['Batería', 'Guitarra eléctrica', 'Bajo', 'Amplificador'] },
    { pista: 'Norteño', palabras: ['Acordeón', 'Bajo sexto', 'Tololoche', 'Corrido'] },
    { pista: 'Quinceañera', palabras: ['Cumbia', 'Salsa', 'Reggaetón', 'Vals', 'DJ'] },
    { pista: 'Radio', palabras: ['Rock', 'Pop', 'Rap', 'Balada'] },
    { pista: 'Tropical', palabras: ['Marimba', 'Bongó', 'Güiro', 'Congas'] },
    { pista: 'España', palabras: ['Castañuelas', 'Flamenco'] },
    { pista: 'Regadera', palabras: ['Karaoke', 'Micrófono', 'Canción'] },
    { pista: 'Celular', palabras: ['Audífonos', 'Bocina', 'Playlist'] },
    { pista: 'Bellas Artes', palabras: ['Ópera', 'Ballet', 'Director de orquesta'] },
    { pista: 'Abuelita', palabras: ['Las Mañanitas', 'Cielito Lindo', 'Villancico'] },
    { pista: 'Bandera', palabras: ['Himno Nacional', 'Banda de guerra'] },
  ],
}

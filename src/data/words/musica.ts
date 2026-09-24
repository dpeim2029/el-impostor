import type { Categoria } from '@/game/types'

export const musica: Categoria = {
  id: 'musica',
  nombre: 'Instrumentos y música',
  emoji: '🎸',
  grupos: [
    { pista: 'Fogata', palabras: ['Guitarra', 'Ukelele', 'Armónica'] },
    {
      pista: 'Preescolar',
      palabras: ['Xilófono', 'Triángulo', 'Pandero', 'Maracas', 'Cascabeles', 'Flauta'],
    },
    { pista: 'Boda', palabras: ['Órgano', 'Coro', 'Arpa'] },
    { pista: 'Beethoven', palabras: ['Piano', 'Orquesta', 'Partitura'] },
    {
      pista: 'Desfile',
      palabras: [
        'Tambor',
        'Tuba',
        'Trombón',
        'Clarinete',
        'Platillos',
        'Corneta',
        'Saxofón',
        'Trompeta',
      ],
    },
    { pista: 'Tapones', palabras: ['Batería', 'Guitarra eléctrica', 'Bajo', 'Amplificador'] },
    { pista: 'Calle', palabras: ['Acordeón', 'Violín'] },
    { pista: 'Pista de baile', palabras: ['Cumbia', 'Salsa', 'Reguetón', 'Vals'] },
    { pista: 'Radio', palabras: ['Rock', 'Pop', 'Rap', 'Balada'] },
    { pista: 'Tropical', palabras: ['Marimba', 'Bongó', 'Congas'] },
    { pista: 'Sevilla', palabras: ['Castañuelas', 'Flamenco'] },
    { pista: 'Ducha', palabras: ['Karaoke', 'Canción'] },
    { pista: 'Celular', palabras: ['Auriculares', 'Altavoz', 'Playlist'] },
    { pista: 'Teatro', palabras: ['Ópera', 'Ballet', 'Director de orquesta'] },
    { pista: 'Abuelita', palabras: ['Bolero', 'Tango', 'Canción de cuna'] },
    { pista: 'Bandera', palabras: ['Himno nacional', 'Banda marcial'] },
  ],
}

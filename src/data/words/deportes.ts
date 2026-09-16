import type { Categoria } from '@/game/types'

export const deportes: Categoria = {
  id: 'deportes',
  nombre: 'Deportes',
  emoji: '⚽',
  grupos: [
    { pista: 'Pasto', palabras: ['Futbol', 'Golf', 'Beisbol', 'Futbol americano'] },
    { pista: 'Red', palabras: ['Voleibol', 'Tenis', 'Ping pong', 'Bádminton'] },
    { pista: 'Cloro', palabras: ['Natación', 'Clavados', 'Waterpolo', 'Nado sincronizado'] },
    { pista: 'Cinturón', palabras: ['Box', 'Lucha libre', 'Karate', 'Judo', 'Taekwondo'] },
    { pista: 'Máscara', palabras: ['Esgrima', 'Hockey', 'Buceo'] },
    { pista: 'Colchoneta', palabras: ['Gimnasia', 'Yoga', 'Porristas'] },
    { pista: 'Chamarra', palabras: ['Esquí', 'Snowboard', 'Patinaje sobre hielo'] },
    { pista: 'Casco', palabras: ['Ciclismo', 'Patineta', 'Patines', 'Motociclismo'] },
    { pista: 'Herradura', palabras: ['Equitación', 'Charrería', 'Polo'] },
    { pista: 'Puntería', palabras: ['Tiro con arco', 'Dardos', 'Boliche', 'Billar'] },
    { pista: 'Cronómetro', palabras: ['Atletismo', 'Maratón', 'Automovilismo'] },
    { pista: 'Rebote', palabras: ['Basquetbol', 'Frontón', 'Squash'] },
    { pista: 'Bloqueador', palabras: ['Surf', 'Vela', 'Voleibol de playa', 'Kayak'] },
    { pista: 'Silencio', palabras: ['Ajedrez', 'Damas'] },
    { pista: 'Proteína', palabras: ['Levantamiento de pesas', 'Crossfit', 'Fisicoculturismo'] },
  ],
}

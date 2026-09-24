import type { Categoria } from '@/game/types'

export const deportes: Categoria = {
  id: 'deportes',
  nombre: 'Deportes',
  emoji: '⚽',
  grupos: [
    { pista: 'Césped', palabras: ['Fútbol', 'Golf', 'Béisbol', 'Fútbol americano'] },
    { pista: 'Red', palabras: ['Voleibol', 'Tenis', 'Ping-pong', 'Bádminton'] },
    { pista: 'Cloro', palabras: ['Natación', 'Waterpolo', 'Clavados'] },
    { pista: 'Medalla', palabras: ['Boxeo', 'Lucha libre', 'Karate', 'Judo', 'Taekwondo'] },
    { pista: 'Máscara', palabras: ['Esgrima', 'Hockey', 'Buceo'] },
    { pista: 'Colchoneta', palabras: ['Gimnasia', 'Yoga', 'Acrobacia'] },
    { pista: 'Chocolate caliente', palabras: ['Esquí', 'Snowboard', 'Patinaje sobre hielo'] },
    { pista: 'Casco', palabras: ['Ciclismo', 'Skate', 'Patines', 'Motociclismo'] },
    { pista: 'Herradura', palabras: ['Equitación', 'Carreras de caballos', 'Rodeo'] },
    { pista: 'Puntería', palabras: ['Tiro con arco', 'Dardos', 'Bolos', 'Billar'] },
    { pista: 'Cronómetro', palabras: ['Atletismo', 'Maratón', 'Automovilismo'] },
    { pista: 'Rebote', palabras: ['Básquetbol', 'Trampolín'] },
    {
      pista: 'Protector solar',
      palabras: ['Surf', 'Esquí acuático', 'Voleibol de playa', 'Kayak', 'Remo'],
    },
    { pista: 'Silencio', palabras: ['Ajedrez', 'Damas'] },
    { pista: 'Proteína', palabras: ['Levantamiento de pesas', 'Culturismo'] },
  ],
}

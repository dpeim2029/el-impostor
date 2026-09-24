import type { Categoria } from '@/game/types'

export const sports: Categoria = {
  id: 'deportes',
  nombre: 'Sports',
  emoji: '⚽',
  grupos: [
    { pista: 'Grass', palabras: ['Soccer', 'Baseball', 'Rugby', 'Cricket'] },
    { pista: 'Net', palabras: ['Volleyball', 'Tennis', 'Table tennis', 'Badminton'] },
    { pista: 'Chlorine', palabras: ['Swimming', 'Water polo', 'Diving'] },
    { pista: 'Belt', palabras: ['Boxing', 'Wrestling', 'Karate', 'Judo', 'Taekwondo'] },
    { pista: 'Mask', palabras: ['Fencing', 'Ice hockey'] },
    { pista: 'Mat', palabras: ['Gymnastics', 'Yoga'] },
    { pista: 'Hot chocolate', palabras: ['Skiing', 'Snowboarding', 'Ice skating'] },
    {
      pista: 'Helmet',
      palabras: ['Cycling', 'Skateboarding', 'Roller skating', 'Motocross', 'BMX'],
    },
    { pista: 'Stable', palabras: ['Horse riding', 'Horse racing', 'Rodeo'] },
    { pista: 'Aim', palabras: ['Archery', 'Darts', 'Bowling'] },
    { pista: 'Stopwatch', palabras: ['Marathon', 'Relay race', 'Car racing'] },
    { pista: 'Bounce', palabras: ['Basketball', 'Trampoline'] },
    { pista: 'Sunscreen', palabras: ['Surfing', 'Sailing', 'Kayaking'] },
    { pista: 'Quiet', palabras: ['Chess', 'Golf'] },
    { pista: 'Protein', palabras: ['Weightlifting', 'Tug of war', 'Rowing'] },
  ],
}

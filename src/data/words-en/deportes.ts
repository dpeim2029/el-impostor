import type { Categoria } from '@/game/types'

export const sports: Categoria = {
  id: 'deportes',
  nombre: 'Sports',
  emoji: '⚽',
  grupos: [
    { pista: 'Grass', palabras: ['Soccer', 'Baseball', 'Rugby'] },
    { pista: 'Net', palabras: ['Volleyball', 'Tennis', 'Table tennis', 'Badminton'] },
    { pista: 'Chlorine', palabras: ['Swimming', 'Water polo', 'Diving'] },
    { pista: 'Belt', palabras: ['Boxing', 'Wrestling', 'Karate', 'Judo', 'Taekwondo'] },
    { pista: 'Mask', palabras: ['Fencing', 'Hockey'] },
    { pista: 'Mat', palabras: ['Gymnastics', 'Yoga'] },
    { pista: 'Gloves', palabras: ['Skiing', 'Snowboarding', 'Ice skating'] },
    { pista: 'Helmet', palabras: ['Cycling', 'Skateboarding', 'Roller skating', 'Motocross'] },
    { pista: 'Horseshoe', palabras: ['Horse riding', 'Polo', 'Rodeo'] },
    { pista: 'Aim', palabras: ['Archery', 'Darts', 'Bowling'] },
    { pista: 'Stopwatch', palabras: ['Marathon', 'Relay race', 'Car racing'] },
    { pista: 'Bounce', palabras: ['Basketball', 'Squash'] },
    { pista: 'Sunscreen', palabras: ['Surfing', 'Sailing', 'Beach volleyball', 'Kayaking'] },
    { pista: 'Quiet', palabras: ['Chess', 'Golf'] },
    { pista: 'Protein', palabras: ['Weightlifting', 'Bodybuilding', 'Rowing'] },
  ],
}

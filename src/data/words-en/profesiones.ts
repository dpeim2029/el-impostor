import type { Categoria } from '@/game/types'

export const jobs: Categoria = {
  id: 'profesiones',
  nombre: 'Jobs',
  emoji: '👩‍🚒',
  grupos: [
    { pista: 'Waiting room', palabras: ['Doctor', 'Nurse', 'Vet'] },
    { pista: 'Lab coat', palabras: ['Scientist', 'Dentist', 'Pharmacist'] },
    { pista: 'Siren', palabras: ['Firefighter', 'Police officer', 'Paramedic'] },
    { pista: 'Whistle', palabras: ['Referee', 'Coach', 'Lifeguard'] },
    { pista: 'Applause', palabras: ['Singer', 'Actor', 'Dancer', 'Magician', 'Musician', 'Clown'] },
    { pista: 'Crane', palabras: ['Builder', 'Engineer', 'Architect'] },
    { pista: 'Sky', palabras: ['Pilot', 'Astronaut', 'Flight attendant'] },
    { pista: 'Hunger', palabras: ['Chef', 'Baker', 'Waiter', 'Butcher'] },
    { pista: 'Sunrise', palabras: ['Farmer', 'Fisherman', 'Gardener'] },
    { pista: 'Classroom', palabras: ['Teacher', 'Librarian'] },
    { pista: 'Tip', palabras: ['Taxi driver', 'Delivery driver', 'Hairdresser'] },
    { pista: 'Wedding', palabras: ['Photographer', 'DJ', 'Florist'] },
    { pista: 'TV studio', palabras: ['Reporter', 'Presenter', 'Camera operator'] },
    { pista: 'Wi-Fi', palabras: ['Programmer', 'Designer', 'YouTuber'] },
    { pista: 'Anchor', palabras: ['Sailor', 'Captain', 'Diver'] },
    { pista: 'Stadium', palabras: ['Goalkeeper', 'Athlete', 'Mascot'] },
    { pista: 'Tie', palabras: ['Lawyer', 'Judge', 'Banker'] },
    { pista: 'Toolbox', palabras: ['Plumber', 'Electrician', 'Locksmith', 'Mechanic'] },
    { pista: 'Parade', palabras: ['Soldier', 'Drummer'] },
  ],
}

import type { Categoria } from '@/game/types'

export const transport: Categoria = {
  id: 'transporte',
  nombre: 'Transport',
  emoji: '🚌',
  grupos: [
    { pista: 'Suitcase', palabras: ['Plane', 'Bus', 'Train'] },
    { pista: 'Traffic light', palabras: ['Car', 'Motorcycle', 'Taxi', 'Van'] },
    { pista: 'Park', palabras: ['Bicycle', 'Scooter', 'Tricycle'] },
    { pista: 'Titanic', palabras: ['Ship', 'Submarine'] },
    { pista: 'Pirate', palabras: ['Sailboat', 'Raft'] },
    { pista: 'Lake', palabras: ['Canoe', 'Rowboat', 'Pedal boat'] },
    { pista: 'Ticket', palabras: ['Tram', 'Metro', 'Ferry'] },
    { pista: 'Siren', palabras: ['Ambulance', 'Police car', 'Fire engine'] },
    { pista: 'Countdown', palabras: ['Rocket', 'Spaceship'] },
    { pista: 'Clouds', palabras: ['Helicopter', 'Hot air balloon', 'Parachute', 'Glider'] },
    { pista: 'Fairy tale', palabras: ['Carriage', 'Magic carpet', 'Sleigh', 'Broomstick'] },
    { pista: 'Farm', palabras: ['Tractor', 'Wheelbarrow', 'Cart'] },
    { pista: 'Mountain', palabras: ['Cable car', 'Ski lift'] },
    { pista: 'Winter', palabras: ['Snowmobile', 'Sled'] },
    { pista: 'Beach', palabras: ['Jet ski', 'Speedboat'] },
    { pista: 'Checkered flag', palabras: ['Go-kart', 'Race car'] },
  ],
}

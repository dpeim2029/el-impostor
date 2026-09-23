import type { Categoria } from '@/game/types'

export const transporte: Categoria = {
  id: 'transporte',
  nombre: 'Transporte',
  emoji: '🚌',
  grupos: [
    { pista: 'Maleta', palabras: ['Avión', 'Crucero', 'Autobús', 'Tren'] },
    { pista: 'Semáforo', palabras: ['Coche', 'Moto', 'Taxi', 'Camioneta'] },
    { pista: 'Parque', palabras: ['Bicicleta', 'Scooter', 'Triciclo'] },
    { pista: 'Titanic', palabras: ['Barco', 'Submarino'] },
    { pista: 'Pirata', palabras: ['Velero', 'Balsa'] },
    { pista: 'Lago', palabras: ['Lancha', 'Canoa', 'Bote'] },
    { pista: 'Andén', palabras: ['Metro', 'Tranvía', 'Tren ligero'] },
    { pista: 'Sirena', palabras: ['Ambulancia', 'Patrulla', 'Camión de bomberos'] },
    { pista: 'Cuenta regresiva', palabras: ['Cohete', 'Nave espacial'] },
    { pista: 'Nubes', palabras: ['Helicóptero', 'Avioneta', 'Globo aerostático', 'Paracaídas'] },
    { pista: 'Cuento', palabras: ['Carroza', 'Alfombra mágica', 'Trineo', 'Escoba voladora'] },
    { pista: 'Granja', palabras: ['Tractor', 'Carreta', 'Carretilla'] },
    {
      pista: 'Centro comercial',
      palabras: ['Ascensor', 'Escaleras eléctricas', 'Carrito de compras'],
    },
    { pista: 'Montaña', palabras: ['Teleférico', 'Funicular'] },
    { pista: 'Barrio', palabras: ['Camión de basura', 'Camión de mudanzas'] },
  ],
}

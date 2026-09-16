import type { Categoria } from '@/game/types'

export const transporte: Categoria = {
  id: 'transporte',
  nombre: 'Transporte',
  emoji: '🚌',
  grupos: [
    { pista: 'Maleta', palabras: ['Avión', 'Crucero', 'Autobús', 'Tren'] },
    { pista: 'Semáforo', palabras: ['Coche', 'Moto', 'Taxi', 'Camioneta'] },
    { pista: 'Parque', palabras: ['Bicicleta', 'Patineta', 'Patines', 'Scooter'] },
    { pista: 'Titanic', palabras: ['Barco', 'Submarino'] },
    { pista: 'Pirata', palabras: ['Velero', 'Balsa'] },
    { pista: 'Xochimilco', palabras: ['Trajinera', 'Lancha', 'Canoa'] },
    { pista: 'Torniquete', palabras: ['Metro', 'Metrobús', 'Tren ligero'] },
    { pista: 'Sirena', palabras: ['Ambulancia', 'Patrulla', 'Camión de bomberos'] },
    { pista: 'Cuenta regresiva', palabras: ['Cohete', 'Nave espacial', 'Transbordador'] },
    { pista: 'Nubes', palabras: ['Helicóptero', 'Avioneta', 'Globo aerostático', 'Paracaídas'] },
    { pista: 'Cuento', palabras: ['Carroza', 'Alfombra mágica', 'Trineo', 'Escoba voladora'] },
    { pista: 'Rancho', palabras: ['Tractor', 'Cuatrimoto', 'Caballo', 'Burro'] },
    {
      pista: 'Centro comercial',
      palabras: ['Elevador', 'Escaleras eléctricas', 'Carrito de súper'],
    },
    { pista: 'Montaña', palabras: ['Teleférico', 'Funicular'] },
    { pista: 'Colonia', palabras: ['Camión de basura', 'Camión de gas', 'Pesero'] },
  ],
}

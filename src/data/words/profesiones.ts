import type { Categoria } from '@/game/types'

export const profesiones: Categoria = {
  id: 'profesiones',
  nombre: 'Profesiones',
  emoji: '👩‍🚒',
  grupos: [
    { pista: 'Sala de espera', palabras: ['Doctor', 'Enfermera', 'Veterinario', 'Psicólogo'] },
    { pista: 'Bata', palabras: ['Científico', 'Dentista', 'Farmacéutico'] },
    { pista: 'Sirena', palabras: ['Bombero', 'Policía', 'Paramédico'] },
    { pista: 'Silbato', palabras: ['Entrenador', 'Salvavidas'] },
    { pista: 'Aplausos', palabras: ['Cantante', 'Actor', 'Bailarina', 'Mago', 'Músico', 'Payaso'] },
    { pista: 'Grúa', palabras: ['Albañil', 'Ingeniero', 'Arquitecto'] },
    { pista: 'Cielo', palabras: ['Piloto', 'Paracaidista', 'Astronauta'] },
    { pista: 'Hambre', palabras: ['Chef', 'Panadero', 'Heladero', 'Carnicero'] },
    { pista: 'Madrugar', palabras: ['Granjero', 'Pescador', 'Barrendero', 'Jardinero'] },
    { pista: 'Recreo', palabras: ['Maestro', 'Director', 'Bibliotecario'] },
    { pista: 'Propina', palabras: ['Taxista', 'Repartidor', 'Guía de turistas'] },
    { pista: 'Boda', palabras: ['Peluquero', 'Fotógrafo', 'DJ', 'Florista'] },
    { pista: 'Noticias', palabras: ['Reportero', 'Locutor', 'Camarógrafo'] },
    { pista: 'Wifi', palabras: ['Programador', 'Diseñador', 'Youtuber'] },
    { pista: 'Ancla', palabras: ['Marinero', 'Capitán', 'Buzo'] },
    { pista: 'Estadio', palabras: ['Futbolista', 'Beisbolista', 'Árbitro'] },
    { pista: 'Corbata', palabras: ['Abogado', 'Juez', 'Banquero'] },
    { pista: 'Timbre', palabras: ['Cartero', 'Pintor', 'Electricista', 'Cerrajero'] },
    { pista: 'Gasolina', palabras: ['Chofer', 'Camionero', 'Mecánico'] },
    { pista: 'Desfile', palabras: ['Soldado', 'Abanderado'] },
  ],
}

import type { Categoria } from '@/game/types'

export const profesiones: Categoria = {
  id: 'profesiones',
  nombre: 'Profesiones',
  emoji: '👩‍🚒',
  grupos: [
    { pista: 'Sala de espera', palabras: ['Doctor', 'Enfermera', 'Veterinario', 'Psicólogo'] },
    { pista: 'Bata', palabras: ['Científico', 'Dentista', 'Farmacéutico'] },
    { pista: 'Sirena', palabras: ['Bombero', 'Policía', 'Paramédico'] },
    { pista: 'Silbato', palabras: ['Árbitro', 'Entrenador', 'Salvavidas'] },
    { pista: 'Aplausos', palabras: ['Cantante', 'Actor', 'Bailarina', 'Mago', 'Músico', 'Payaso'] },
    { pista: 'Grúa', palabras: ['Albañil', 'Ingeniero', 'Arquitecto'] },
    { pista: 'Cielo', palabras: ['Piloto', 'Paracaidista', 'Astronauta'] },
    { pista: 'Hambre', palabras: ['Chef', 'Panadero', 'Mesero', 'Carnicero'] },
    { pista: 'Madrugar', palabras: ['Granjero', 'Pescador', 'Barrendero', 'Jardinero'] },
    { pista: 'Recreo', palabras: ['Maestro', 'Director', 'Conserje'] },
    { pista: 'Propina', palabras: ['Taxista', 'Repartidor', 'Botones'] },
    { pista: 'Boda', palabras: ['Peluquero', 'Fotógrafo', 'DJ', 'Florista'] },
    { pista: 'Noticias', palabras: ['Reportero', 'Locutor', 'Camarógrafo'] },
    { pista: 'Wifi', palabras: ['Programador', 'Diseñador', 'Youtuber'] },
    { pista: 'Ancla', palabras: ['Marinero', 'Capitán', 'Buzo'] },
    { pista: 'Estadio', palabras: ['Futbolista', 'Portero', 'Beisbolista'] },
    { pista: 'Corbata', palabras: ['Abogado', 'Juez', 'Banquero'] },
    { pista: 'Timbre', palabras: ['Cartero', 'Plomero', 'Electricista', 'Cerrajero'] },
    { pista: 'Gasolina', palabras: ['Chofer', 'Camionero', 'Mecánico'] },
    { pista: 'Desfile', palabras: ['Soldado', 'Abanderado'] },
  ],
}

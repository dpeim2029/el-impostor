import type { Categoria } from '@/game/types'

export const escuela: Categoria = {
  id: 'escuela',
  nombre: 'Escuela',
  emoji: '🎒',
  grupos: [
    {
      pista: 'Papelería',
      palabras: [
        'Cuaderno',
        'Lápiz',
        'Bolígrafo',
        'Goma de borrar',
        'Sacapuntas',
        'Regla',
        'Tijeras',
        'Pegamento',
        'Cartulina',
      ],
    },
    { pista: 'Recreo', palabras: ['Patio', 'Campana', 'Columpio'] },
    { pista: 'Primer día', palabras: ['Uniforme', 'Mochila'] },
    { pista: 'Calificación', palabras: ['Examen', 'Tarea', 'Diploma'] },
    { pista: 'Maestra', palabras: ['Pizarra', 'Tiza', 'Lista'] },
    { pista: 'Biblioteca', palabras: ['Libro', 'Diccionario', 'Cuento', 'Atlas'] },
    { pista: 'Laboratorio', palabras: ['Microscopio', 'Bata', 'Lupa'] },
    { pista: 'Tablas de multiplicar', palabras: ['Calculadora', 'Compás', 'Ábaco'] },
    { pista: 'Fin de curso', palabras: ['Escenario', 'Telón', 'Micrófono'] },
    { pista: 'Entrenador', palabras: ['Balón', 'Silbato', 'Cancha', 'Cono'] },
    { pista: 'Artista', palabras: ['Pincel', 'Acuarelas', 'Plastilina', 'Crayones'] },
    { pista: 'Internet', palabras: ['Teclado', 'Mouse', 'Tableta', 'Proyector'] },
  ],
}

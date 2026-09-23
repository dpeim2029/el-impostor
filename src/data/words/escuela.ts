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
    { pista: 'Lunes', palabras: ['Uniforme', 'Mochila', 'Bandera'] },
    { pista: 'Calificación', palabras: ['Examen', 'Tarea', 'Diploma'] },
    { pista: 'Maestra', palabras: ['Pizarra', 'Tiza', 'Lista'] },
    { pista: 'Biblioteca', palabras: ['Libro', 'Diccionario', 'Enciclopedia', 'Atlas'] },
    { pista: 'Laboratorio', palabras: ['Microscopio', 'Bata', 'Lupa'] },
    { pista: 'Ingeniero', palabras: ['Calculadora', 'Compás', 'Escuadra', 'Transportador'] },
    { pista: 'Festival', palabras: ['Escenario', 'Telón', 'Micrófono'] },
    { pista: 'Entrenador', palabras: ['Balón', 'Silbato', 'Cancha', 'Cono'] },
    { pista: 'Museo', palabras: ['Pincel', 'Acuarelas', 'Plastilina', 'Crayones'] },
    { pista: 'Internet', palabras: ['Teclado', 'Mouse', 'Tableta', 'Proyector'] },
  ],
}

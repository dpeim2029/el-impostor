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
        'Pluma',
        'Borrador',
        'Sacapuntas',
        'Regla',
        'Colores',
        'Tijeras',
        'Pegamento',
        'Cartulina',
      ],
    },
    { pista: 'Recreo', palabras: ['Lonchera', 'Patio', 'Campana', 'Columpio'] },
    { pista: 'Lunes', palabras: ['Uniforme', 'Mochila', 'Bandera'] },
    { pista: 'Calificación', palabras: ['Examen', 'Boleta', 'Tarea'] },
    { pista: 'Maestra', palabras: ['Pizarrón', 'Gis', 'Lista', 'Escritorio'] },
    { pista: 'Biblioteca', palabras: ['Libro', 'Diccionario', 'Enciclopedia', 'Atlas'] },
    { pista: 'Laboratorio', palabras: ['Microscopio', 'Bata', 'Probeta', 'Lupa'] },
    { pista: 'Ingeniero', palabras: ['Calculadora', 'Compás', 'Escuadra', 'Transportador'] },
    { pista: 'Festival', palabras: ['Disfraz', 'Escenario', 'Micrófono', 'Bailable'] },
    { pista: 'Entrenador', palabras: ['Balón', 'Silbato', 'Cancha', 'Cono'] },
    { pista: 'Museo', palabras: ['Pincel', 'Acuarelas', 'Plastilina', 'Crayolas'] },
    { pista: 'Internet', palabras: ['Teclado', 'Mouse', 'Tableta', 'Proyector'] },
  ],
}

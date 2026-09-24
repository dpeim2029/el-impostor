import type { Categoria } from '@/game/types'

export const mexico: Categoria = {
  id: 'mexico',
  nombre: 'México',
  emoji: '🇲🇽',
  // Cultura de México: activa por defecto solo si el dispositivo está en esa región.
  regiones: ['MX'],
  grupos: [
    { pista: 'Fonda', palabras: ['Mole', 'Pozole', 'Sopes', 'Enchiladas'] },
    { pista: 'Domingo', palabras: ['Chilaquiles', 'Barbacoa', 'Menudo'] },
    { pista: 'Triciclo', palabras: ['Esquites', 'Elote', 'Raspado'] },
    { pista: 'Oaxaca', palabras: ['Tlayuda', 'Chapulines', 'Alebrije'] },
    { pista: 'Merienda', palabras: ['Concha', 'Bolillo', 'Cuernito'] },
    { pista: 'Esquina', palabras: ['Torta', 'Gordita', 'Tacos de canasta', 'Quesadilla'] },
    { pista: 'Mercado', palabras: ['Nopal', 'Tuna', 'Jícama', 'Chayote', 'Ejote', 'Tomate verde'] },
    { pista: 'Capital', palabras: ['Trajinera', 'Pesero', 'Metrobús', 'Zócalo'] },
    { pista: 'Colonia', palabras: ['Camión de gas', 'Tortillería', 'Tiendita'] },
    { pista: 'Propina', palabras: ['Viene-viene', 'Cerillo', 'Taquero'] },
    { pista: 'Jalisco', palabras: ['Charro', 'Charrería', 'Guitarrón', 'Vihuela', 'Mariachi'] },
    { pista: 'Norteño', palabras: ['Tololoche', 'Bajo sexto', 'Cabrito'] },
    { pista: 'Serenata', palabras: ['Las mañanitas', 'Cielito lindo'] },
    { pista: 'Kermés', palabras: ['Cascarones', 'Espantasuegras'] },
    {
      pista: 'Diciembre',
      palabras: ['Día de la Virgen de Guadalupe', 'Posadas', 'Ponche', 'Tejocote'],
    },
    {
      pista: 'Noviembre',
      palabras: [
        'Cempasúchil',
        'Pan de muerto',
        'Calaverita',
        'Día de la Revolución',
        'Buen Fin',
        'Día de Muertos',
        'Altar',
        'Catrina',
      ],
    },
    {
      pista: 'Septiembre',
      palabras: ['Grito de Independencia', 'Noche mexicana', 'Chiles en nogada'],
    },
    { pista: 'Febrero', palabras: ['Día de la Candelaria', 'Día de la Bandera', 'Tamales'] },
  ],
}

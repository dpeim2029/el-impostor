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
    { pista: 'Esquina', palabras: ['Torta', 'Gordita', 'Tacos de canasta'] },
    { pista: 'Mercado', palabras: ['Nopal', 'Tuna', 'Jícama', 'Chayote', 'Ejote', 'Tomate verde'] },
    { pista: 'Capital', palabras: ['Trajinera', 'Pesero', 'Metrobús', 'Zócalo'] },
    { pista: 'Colonia', palabras: ['Camión de gas', 'Tortillería', 'Tiendita'] },
    { pista: 'Propina', palabras: ['Bolero', 'Cerillo', 'Taquero'] },
    { pista: 'Jalisco', palabras: ['Charro', 'Charrería', 'Guitarrón', 'Vihuela'] },
    { pista: 'Norteño', palabras: ['Tololoche', 'Bajo sexto', 'Corrido'] },
    { pista: 'Serenata', palabras: ['Las Mañanitas', 'Cielito Lindo'] },
    { pista: 'Confeti', palabras: ['Cascarones', 'Espantasuegras'] },
    {
      pista: 'Diciembre',
      palabras: ['Día de la Virgen de Guadalupe', 'Posadas', 'Ponche', 'Tejocote'],
    },
    {
      pista: 'Noviembre',
      palabras: ['Cempasúchil', 'Pan de muerto', 'Calaverita', 'Día de la Revolución', 'Buen Fin'],
    },
    {
      pista: 'Septiembre',
      palabras: ['Grito de Independencia', 'Noche mexicana', 'Chiles en nogada'],
    },
    {
      pista: 'Febrero',
      palabras: ['Día de la Candelaria', 'Día de la Bandera', 'Día del Amor y la Amistad'],
    },
  ],
}

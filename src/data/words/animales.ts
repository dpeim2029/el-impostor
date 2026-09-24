import type { Categoria } from '@/game/types'

export const animales: Categoria = {
  id: 'animales',
  nombre: 'Animales',
  emoji: '🦁',
  grupos: [
    {
      pista: 'Safari',
      palabras: ['León', 'Elefante', 'Jirafa', 'Cebra', 'Hipopótamo', 'Rinoceronte'],
    },
    { pista: 'Tarzán', palabras: ['Mono', 'Serpiente', 'Leopardo', 'Loro', 'Cocodrilo'] },
    { pista: 'Granja', palabras: ['Vaca', 'Caballo', 'Gallina', 'Cerdo', 'Oveja', 'Burro'] },
    { pista: 'Veterinario', palabras: ['Perro', 'Gato', 'Hámster', 'Conejo'] },
    { pista: 'Submarino', palabras: ['Tiburón', 'Delfín', 'Pulpo', 'Ballena', 'Tortuga'] },
    { pista: 'Halloween', palabras: ['Murciélago', 'Búho', 'Araña'] },
    { pista: 'Bosque', palabras: ['Lobo', 'Oso', 'Zorro', 'Venado', 'Ardilla'] },
    { pista: 'Jardín', palabras: ['Mariposa', 'Abeja', 'Caracol', 'Hormiga'] },
    { pista: 'Iceberg', palabras: ['Pingüino', 'Oso polar', 'Foca'] },
  ],
}

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
    {
      pista: 'Tarzán',
      palabras: ['Mono', 'Serpiente', 'Tigre', 'Loro', 'Cocodrilo'],
    },
    {
      pista: 'Rancho',
      palabras: ['Vaca', 'Caballo', 'Gallina', 'Cerdo', 'Borrego', 'Burro'],
    },
    {
      pista: 'Veterinario',
      palabras: ['Perro', 'Gato', 'Hámster', 'Conejo'],
    },
    {
      pista: 'Buzo',
      palabras: ['Tiburón', 'Delfín', 'Pulpo', 'Ballena', 'Tortuga'],
    },
    {
      pista: 'Halloween',
      palabras: ['Murciélago', 'Búho', 'Araña'],
    },
    {
      pista: 'Bosque',
      palabras: ['Lobo', 'Oso', 'Zorro', 'Venado', 'Ardilla'],
    },
    {
      pista: 'Jardín',
      palabras: ['Mariposa', 'Abeja', 'Caracol', 'Hormiga'],
    },
    {
      pista: 'Iglú',
      palabras: ['Pingüino', 'Oso polar', 'Foca'],
    },
  ],
}

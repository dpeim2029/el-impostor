import type { Categoria } from '@/game/types'

export const casa: Categoria = {
  id: 'casa',
  nombre: 'Cosas de la casa',
  emoji: '🏠',
  grupos: [
    { pista: 'Chef', palabras: ['Sartén', 'Olla', 'Licuadora', 'Cuchillo', 'Horno'] },
    {
      pista: 'Electricista',
      palabras: ['Refrigerador', 'Microondas', 'Lavadora', 'Lámpara', 'Ventilador', 'Plancha'],
    },
    { pista: 'Hotel', palabras: ['Cama', 'Almohada', 'Sábana', 'Toalla', 'Jabón'] },
    { pista: 'Gotera', palabras: ['Ducha', 'Lavabo', 'Inodoro', 'Tubería'] },
    { pista: 'Mañana', palabras: ['Cepillo de dientes', 'Peine', 'Espejo', 'Champú'] },
    { pista: 'Visitas', palabras: ['Sofá', 'Cojín', 'Alfombra', 'Cortina'] },
    {
      pista: 'Restaurante',
      palabras: ['Plato', 'Vaso', 'Cuchara', 'Tenedor', 'Servilleta', 'Mesa', 'Silla'],
    },
    { pista: 'Cenicienta', palabras: ['Escoba', 'Balde', 'Trapo', 'Recogedor'] },
    { pista: 'Tarea', palabras: ['Escritorio', 'Computadora', 'Estante'] },
    { pista: 'Cartero', palabras: ['Puerta', 'Timbre', 'Buzón'] },
    { pista: 'Ladrón', palabras: ['Ventana', 'Llave', 'Candado'] },
    { pista: 'Martillo', palabras: ['Reloj', 'Cuadro', 'Calendario', 'Repisa'] },
    { pista: 'Jardinero', palabras: ['Manguera', 'Maceta', 'Pala'] },
    { pista: 'Cigüeña', palabras: ['Cuna', 'Biberón', 'Pañal', 'Chupete', 'Sonajero'] },
    { pista: 'Netflix', palabras: ['Televisión', 'Control remoto', 'Consola'] },
  ],
}

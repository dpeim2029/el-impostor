import type { Categoria } from '@/game/types'

export const casa: Categoria = {
  id: 'casa',
  nombre: 'Cosas de la casa',
  emoji: '🏠',
  grupos: [
    { pista: 'Chef', palabras: ['Sartén', 'Olla', 'Licuadora', 'Cuchillo', 'Estufa'] },
    {
      pista: 'Electricista',
      palabras: ['Refrigerador', 'Microondas', 'Lavadora', 'Lámpara', 'Ventilador', 'Plancha'],
    },
    { pista: 'Hotel', palabras: ['Cama', 'Almohada', 'Cobija', 'Toalla', 'Jabón'] },
    { pista: 'Plomero', palabras: ['Regadera', 'Lavabo', 'Escusado', 'Tinaco'] },
    { pista: 'Mañana', palabras: ['Cepillo de dientes', 'Peine', 'Espejo', 'Shampoo'] },
    { pista: 'Visitas', palabras: ['Sofá', 'Cojín', 'Alfombra', 'Cortina'] },
    {
      pista: 'Restaurante',
      palabras: ['Plato', 'Vaso', 'Cuchara', 'Tenedor', 'Servilleta', 'Mesa', 'Silla'],
    },
    { pista: 'Cenicienta', palabras: ['Escoba', 'Trapeador', 'Cubeta', 'Trapo'] },
    { pista: 'Tarea', palabras: ['Escritorio', 'Computadora', 'Librero'] },
    { pista: 'Cartero', palabras: ['Puerta', 'Timbre', 'Buzón'] },
    { pista: 'Ladrón', palabras: ['Ventana', 'Llave', 'Candado'] },
    { pista: 'Martillo', palabras: ['Reloj', 'Cuadro', 'Calendario', 'Repisa'] },
    { pista: 'Jardinero', palabras: ['Manguera', 'Maceta', 'Podadora', 'Pala'] },
    { pista: 'Cigüeña', palabras: ['Cuna', 'Biberón', 'Pañal', 'Chupón', 'Sonaja'] },
    { pista: 'Netflix', palabras: ['Televisión', 'Control remoto', 'Bocina'] },
  ],
}

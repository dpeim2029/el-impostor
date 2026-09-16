import { createContext, useContext } from 'react'
import type { Accion } from './store'
import type { EstadoJuego } from './types'

export interface ContextoJuego {
  estado: EstadoJuego
  dispatch: (accion: Accion) => void
}

export const Contexto = createContext<ContextoJuego | null>(null)

export function useJuego(): ContextoJuego {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useJuego debe usarse dentro de <JuegoProvider>')
  return contexto
}

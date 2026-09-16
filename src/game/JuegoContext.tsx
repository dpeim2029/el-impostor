import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { cargarEstado, guardarEstado, reducer, type Accion } from './store'
import type { EstadoJuego } from './types'

interface ContextoJuego {
  estado: EstadoJuego
  dispatch: (accion: Accion) => void
}

const Contexto = createContext<ContextoJuego | null>(null)

function almacen(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

export function JuegoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, undefined, () => cargarEstado(almacen()))

  useEffect(() => {
    guardarEstado(almacen(), estado)
  }, [estado])

  const valor = useMemo(() => ({ estado, dispatch }), [estado])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useJuego(): ContextoJuego {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useJuego debe usarse dentro de <JuegoProvider>')
  return contexto
}

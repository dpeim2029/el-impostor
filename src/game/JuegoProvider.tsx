import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { Contexto } from './JuegoContext'
import { cargarEstado, guardarEstado, reducer } from './store'

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

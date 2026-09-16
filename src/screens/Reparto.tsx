import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { BotonCancelarRonda } from '@/components/BotonCancelarRonda'
import { CartaJugador } from '@/components/CartaJugador'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'
import type { Palabra, Rol, VariantePista } from '@/game/types'

export function Reparto() {
  const { estado, dispatch } = useJuego()
  const { jugadores, indiceReparto, ronda, ajustes } = estado
  const jugador = jugadores[indiceReparto]
  if (!ronda || !jugador) return null

  return (
    <RepartoJugador
      key={jugador.id}
      nombre={jugador.nombre}
      posicion={indiceReparto + 1}
      total={jugadores.length}
      palabra={ronda.palabra}
      rol={ronda.roles[jugador.id]}
      variantePista={ajustes.variantePista}
      onSiguiente={() => dispatch({ tipo: 'siguienteCarta' })}
    />
  )
}

function RepartoJugador({
  nombre,
  posicion,
  total,
  palabra,
  rol,
  variantePista,
  onSiguiente,
}: {
  nombre: string
  posicion: number
  total: number
  palabra: Palabra
  rol: Rol
  variantePista: VariantePista
  onSiguiente: () => void
}) {
  const [vista, setVista] = useState(false)
  const esUltimo = posicion === total

  return (
    <Pantalla
      titulo={`Carta ${posicion} de ${total}`}
      accion={<BotonCancelarRonda />}
      pie={
        <Button
          size="lg"
          className="h-14 text-lg font-semibold"
          disabled={!vista}
          onClick={onSiguiente}
        >
          {esUltimo ? '¡Todos listos, a jugar!' : 'Ya la vi, pasar el teléfono'}
          <ArrowRight className="size-5" />
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <p className="text-sm text-muted-foreground">Pásale el teléfono a</p>
        <p className="font-heading text-4xl font-extrabold text-balance">{nombre}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Que nadie más mire la pantalla mientras la ve.
        </p>
      </div>

      <div className="flex-1" />

      <CartaJugador
        rol={rol}
        palabra={palabra}
        variantePista={variantePista}
        onVista={() => setVista(true)}
      />

      <div className="flex-1" />
    </Pantalla>
  )
}

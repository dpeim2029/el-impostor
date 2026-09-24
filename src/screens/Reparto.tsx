import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { BotonCancelarRonda } from '@/components/BotonCancelarRonda'
import { CartaJugador } from '@/components/CartaJugador'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'
import type { Palabra, Rol } from '@/game/types'

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
      conPista={ajustes.conPista}
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
  conPista,
  onSiguiente,
}: {
  nombre: string
  posicion: number
  total: number
  palabra: Palabra
  rol: Rol
  conPista: boolean
  onSiguiente: () => void
}) {
  const [vista, setVista] = useState(false)
  const esUltimo = posicion === total

  return (
    <Pantalla
      titulo={`${posicion} de ${total}`}
      accion={<BotonCancelarRonda />}
      pie={
        <Button
          size="lg"
          className="h-14 text-lg font-semibold"
          disabled={!vista}
          onClick={onSiguiente}
        >
          {esUltimo ? 'Jugar' : 'Pasar el teléfono'}
          <ArrowRight className="size-5" />
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <p className="text-sm text-muted-foreground">Pasa el teléfono a</p>
        <p className="font-heading text-4xl font-extrabold text-balance">{nombre}</p>
      </div>

      <div className="flex-1" />

      <CartaJugador
        rol={rol}
        palabra={palabra}
        conPista={conPista}
        onVista={() => setVista(true)}
      />

      <div className="flex-1" />
    </Pantalla>
  )
}

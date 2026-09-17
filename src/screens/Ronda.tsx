import { RotateCcw } from 'lucide-react'
import { BotonCancelarRonda } from '@/components/BotonCancelarRonda'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'
import { cn } from '@/lib/utils'

export function Ronda() {
  const { estado, dispatch } = useJuego()
  const { ronda, jugadores } = estado
  if (!ronda) return null

  const porId = new Map(jugadores.map((j) => [j.id, j]))
  const orden = ronda.orden.map((id) => porId.get(id)).filter((j) => j !== undefined)
  const primero = orden[0]

  return (
    <Pantalla
      titulo={ronda.vuelta === 1 ? 'Ronda' : `Vuelta ${ronda.vuelta}`}
      accion={<BotonCancelarRonda />}
      pie={
        <>
          <Button
            size="lg"
            className="h-14 text-lg font-semibold"
            onClick={() => dispatch({ tipo: 'irAVotar' })}
          >
            Votar
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 text-muted-foreground"
            onClick={() => dispatch({ tipo: 'otraVuelta' })}
          >
            <RotateCcw className="size-4" />
            Otra vuelta
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <p className="text-sm text-muted-foreground">Empieza</p>
        <p className="font-heading text-4xl font-extrabold text-balance">{primero?.nombre}</p>
        <p className="mt-1 text-sm text-muted-foreground">Una palabra cada quien, en este orden.</p>
      </div>

      <ol className="flex flex-col gap-2">
        {orden.map((jugador, i) => (
          <li
            key={jugador.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3',
              i === 0 ? 'border border-primary/50 bg-primary/15' : 'bg-card/70',
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
              {i + 1}
            </span>
            <span className="flex-1 truncate font-medium">{jugador.nombre}</span>
          </li>
        ))}
      </ol>
    </Pantalla>
  )
}

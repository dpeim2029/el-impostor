import { RotateCcw, Vote } from 'lucide-react'
import { BotonCancelarRonda } from '@/components/BotonCancelarRonda'
import { Pantalla } from '@/components/Pantalla'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { impostoresDe } from '@/game/engine'
import { useJuego } from '@/game/JuegoContext'
import { cn } from '@/lib/utils'

export function Ronda() {
  const { estado, dispatch } = useJuego()
  const { ronda, jugadores } = estado
  if (!ronda) return null

  const porId = new Map(jugadores.map((j) => [j.id, j]))
  const orden = ronda.orden.map((id) => porId.get(id)).filter((j) => j !== undefined)
  const primero = orden[0]
  const numImpostores = impostoresDe(ronda).length

  return (
    <Pantalla
      titulo={ronda.vuelta === 1 ? 'Ronda de palabras' : `Vuelta ${ronda.vuelta}`}
      accion={<BotonCancelarRonda />}
      pie={
        <>
          <Button
            size="lg"
            className="h-14 text-lg font-semibold"
            onClick={() => dispatch({ tipo: 'irAVotar' })}
          >
            <Vote className="size-5" />
            ¡A votar!
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12"
            onClick={() => dispatch({ tipo: 'otraVuelta' })}
          >
            <RotateCcw className="size-4" />
            Otra vuelta de palabras
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <p className="text-sm text-muted-foreground">Empieza</p>
        <p className="font-heading text-4xl font-extrabold text-balance">{primero?.nombre}</p>
        <p className="mt-1 max-w-xs text-sm text-balance text-muted-foreground">
          Cada quien dice <strong className="text-foreground">una palabra</strong> relacionada con
          la secreta, siguiendo el orden de la lista.
        </p>
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
            {i === 0 && <Badge>Empieza</Badge>}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl bg-card/50 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Recuerden</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Nada de decir la palabra secreta ni repetir la de otro.</li>
          <li>
            Hay {numImpostores === 1 ? 'un impostor' : 'dos impostores'} en la mesa. Fíjense en
            quién titubea o suelta algo demasiado genérico.
          </li>
          <li>Si dudan, pidan otra vuelta antes de votar.</li>
        </ul>
      </div>
    </Pantalla>
  )
}

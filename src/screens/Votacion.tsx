import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { BotonCancelarRonda } from '@/components/BotonCancelarRonda'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { acusacionesPermitidas } from '@/game/engine'
import { useJuego } from '@/game/JuegoContext'
import { cn } from '@/lib/utils'

export function Votacion() {
  const { estado, dispatch } = useJuego()
  const { ronda, jugadores } = estado
  const [pendiente, setPendiente] = useState<string | null>(null)
  const [revelando, setRevelando] = useState(false)
  if (!ronda) return null

  const porId = new Map(jugadores.map((j) => [j.id, j]))
  const permitidas = acusacionesPermitidas(ronda)
  const hechas = ronda.acusaciones.length
  const faltan = permitidas - hechas
  const ultimo = hechas > 0 ? porId.get(ronda.acusaciones[hechas - 1]) : undefined
  const candidato = pendiente ? porId.get(pendiente) : undefined

  const confirmar = () => {
    if (!pendiente) return
    dispatch({ tipo: 'acusar', id: pendiente })
    setPendiente(null)
    setRevelando(true)
  }

  if (revelando && ultimo) {
    const eraImpostor = ronda.roles[ultimo.id] === 'impostor'
    return (
      <Pantalla
        titulo={permitidas > 1 ? `${hechas} de ${permitidas}` : 'Votación'}
        pie={
          <Button
            size="lg"
            className="h-14 text-lg font-semibold"
            onClick={() =>
              faltan > 0 ? setRevelando(false) : dispatch({ tipo: 'verResultado' })
            }
          >
            {faltan > 0 ? 'Siguiente' : 'Resultado'}
            <ArrowRight className="size-5" />
          </Button>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className={cn(
              'animate-in zoom-in-90 fade-in flex w-full flex-col items-center gap-3 rounded-3xl border-2 p-8 duration-300',
              eraImpostor ? 'border-impostor/60 bg-impostor/15' : 'border-civil/60 bg-civil/10',
            )}
          >
            <span className="text-6xl" aria-hidden="true">
              {eraImpostor ? '🕵️' : '😇'}
            </span>
            <p className="text-lg text-muted-foreground">{ultimo.nombre} era…</p>
            <p
              className={cn(
                'font-heading text-4xl font-extrabold',
                eraImpostor ? 'text-impostor' : 'text-civil',
              )}
            >
              {eraImpostor ? '¡Impostor!' : 'Civil'}
            </p>
          </div>
        </div>
      </Pantalla>
    )
  }

  return (
    <Pantalla
      titulo={permitidas > 1 ? `Acusación ${hechas + 1} de ${permitidas}` : 'Votación'}
      accion={<BotonCancelarRonda />}
    >
      <p className="font-heading pt-2 text-center text-3xl font-extrabold">¿Quién es el impostor?</p>

      <ul className="flex flex-col gap-2">
        {jugadores.map((jugador) => {
          const acusado = ronda.acusaciones.includes(jugador.id)
          const eraImpostor = ronda.roles[jugador.id] === 'impostor'
          return (
            <li key={jugador.id}>
              <button
                type="button"
                disabled={acusado}
                onClick={() => setPendiente(jugador.id)}
                className={cn(
                  'flex h-14 w-full items-center justify-between rounded-2xl border px-4 text-left text-lg font-semibold transition-colors',
                  acusado
                    ? eraImpostor
                      ? 'border-impostor/50 bg-impostor/10 text-impostor'
                      : 'border-civil/40 bg-civil/10 text-civil'
                    : 'border-border bg-card/70 hover:bg-card active:bg-accent',
                )}
              >
                <span className="truncate">{jugador.nombre}</span>
                {acusado && (
                  <span className="text-sm font-medium">{eraImpostor ? 'Impostor' : 'Civil'}</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <Dialog open={candidato !== undefined} onOpenChange={(abierto) => !abierto && setPendiente(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>¿Acusar a {candidato?.nombre}?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendiente(null)}>
              No
            </Button>
            <Button onClick={confirmar}>Acusar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Pantalla>
  )
}

import { AvisoInstalarIOS } from '@/components/AvisoInstalarIOS'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'
import { cn } from '@/lib/utils'

export function Inicio() {
  const { estado, dispatch } = useJuego()
  const { conPista } = estado.ajustes

  return (
    <Pantalla className="justify-center gap-10 py-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-28 items-center justify-center rounded-[2.25rem] bg-impostor/15 text-7xl shadow-[0_0_80px_-10px] shadow-impostor/50">
          <span aria-hidden="true">🕵️</span>
        </span>
        <h1 className="font-heading text-5xl font-extrabold tracking-tight">El Impostor</h1>
        <p className="text-balance text-muted-foreground">
          Todos saben la palabra menos uno. Encuéntrenlo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div
          role="radiogroup"
          aria-label="Modo de juego"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-card/70 p-1"
        >
          {(
            [
              { valor: true, etiqueta: 'Con pistas' },
              { valor: false, etiqueta: 'Sin pistas' },
            ] as const
          ).map(({ valor, etiqueta }) => {
            const activo = conPista === valor
            return (
              <button
                key={etiqueta}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => dispatch({ tipo: 'setConPista', conPista: valor })}
                className={cn(
                  'h-11 rounded-xl text-base font-semibold transition-colors',
                  activo ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                {etiqueta}
              </button>
            )
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {conPista ? 'El impostor recibe una pista lejana.' : 'El impostor entra a ciegas.'}
        </p>

        <Button
          size="lg"
          className="h-14 text-lg font-semibold"
          onClick={() => dispatch({ tipo: 'ir', fase: 'ajustes' })}
        >
          Jugar
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="h-12 text-muted-foreground"
          onClick={() => dispatch({ tipo: 'ir', fase: 'como-jugar' })}
        >
          Cómo se juega
        </Button>
      </div>

      <AvisoInstalarIOS />

      <a
        href="https://x.com/danielpeimbert"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hecho por Daniel Peimbert. Abre su perfil en X."
        className="text-center text-sm text-muted-foreground"
      >
        Hecho por <span className="font-semibold">@danielpeimbert</span>
      </a>
    </Pantalla>
  )
}

import { Eye, EyeOff, Fingerprint } from 'lucide-react'
import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Palabra, Rol, VariantePista } from '@/game/types'

interface CartaJugadorProps {
  rol: Rol
  palabra: Palabra
  variantePista: VariantePista
  onVista: () => void
}

/**
 * La carta secreta. Se muestra solo mientras el jugador la mantiene presionada,
 * para que al soltar el teléfono nadie más la vea.
 */
/** Con mouse (escritorio) mantener presionado es incómodo; en pantallas táctiles es lo que protege la carta. */
function prefiereToque(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

export function CartaJugador({ rol, palabra, variantePista, onVista }: CartaJugadorProps) {
  const [visible, setVisible] = useState(false)
  const [modoToque, setModoToque] = useState(prefiereToque)

  const mostrar = () => {
    setVisible(true)
    onVista()
  }
  const ocultar = () => setVisible(false)

  const alPresionar = (evento: PointerEvent<HTMLButtonElement>) => {
    if (modoToque) return
    evento.currentTarget.setPointerCapture(evento.pointerId)
    mostrar()
  }

  const alSoltar = () => {
    if (modoToque) return
    ocultar()
  }

  const alTocar = () => {
    if (!modoToque) return
    if (visible) ocultar()
    else mostrar()
  }

  const alTeclear = (evento: KeyboardEvent<HTMLButtonElement>) => {
    if (evento.key !== ' ' && evento.key !== 'Enter') return
    evento.preventDefault()
    if (visible) ocultar()
    else mostrar()
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-pressed={visible}
        aria-label={visible ? 'Carta visible' : 'Mantén presionado para ver tu carta'}
        className={cn(
          'no-callout relative flex min-h-80 w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 p-6 text-center transition-colors duration-150 outline-none focus-visible:ring-4 focus-visible:ring-ring/40',
          visible
            ? rol === 'impostor'
              ? 'border-impostor/60 bg-impostor/15'
              : 'border-civil/60 bg-civil/10'
            : 'border-dashed border-border bg-card/70 active:bg-card',
        )}
        onPointerDown={alPresionar}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onLostPointerCapture={alSoltar}
        onClick={alTocar}
        onKeyDown={alTeclear}
        onContextMenu={(e) => e.preventDefault()}
      >
        {visible ? (
          rol === 'impostor' ? (
            <ContenidoImpostor palabra={palabra} variantePista={variantePista} />
          ) : (
            <ContenidoCivil palabra={palabra} />
          )
        ) : (
          <>
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Fingerprint className="size-10" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold">
              {modoToque ? 'Toca para ver tu carta' : 'Mantén presionado para ver tu carta'}
            </span>
            <span className="text-sm text-muted-foreground">
              {modoToque
                ? 'Vuelve a tocar para ocultarla antes de pasar el teléfono.'
                : 'Se oculta sola en cuanto la sueltas.'}
            </span>
          </>
        )}
      </button>

      <Button
        variant="ghost"
        size="sm"
        className="self-center text-muted-foreground"
        onClick={() => {
          setModoToque((m) => !m)
          ocultar()
        }}
      >
        {modoToque ? <EyeOff /> : <Eye />}
        {modoToque ? 'Volver a mantener presionado' : '¿Prefieres tocar para mostrar y ocultar?'}
      </Button>
    </div>
  )
}

function ContenidoCivil({ palabra }: { palabra: Palabra }) {
  return (
    <>
      <Badge variant="outline" className="h-auto gap-1.5 border-civil/40 px-3 py-1 text-sm">
        <span aria-hidden="true">{palabra.categoriaEmoji}</span>
        {palabra.categoriaNombre}
      </Badge>
      <p className="text-sm text-muted-foreground">La palabra secreta es</p>
      <p className="font-heading text-4xl leading-tight font-extrabold text-balance sm:text-5xl">
        {palabra.texto}
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        En tu turno di <strong className="text-foreground">una</strong> palabra relacionada. Nunca
        digas esta.
      </p>
    </>
  )
}

function ContenidoImpostor({
  palabra,
  variantePista,
}: {
  palabra: Palabra
  variantePista: VariantePista
}) {
  return (
    <>
      <Badge className="h-auto bg-impostor px-3 py-1 text-sm text-impostor-foreground">
        Shhh…
      </Badge>
      <p className="font-heading text-4xl leading-tight font-extrabold text-impostor sm:text-5xl">
        Eres el impostor
      </p>
      {variantePista === 'pista-lejana' ? (
        <>
          <div className="rounded-2xl bg-background/60 px-5 py-3">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Tu pista lejana
            </p>
            <p className="font-heading text-2xl font-bold">{palabra.pista}</p>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            La pista solo te acerca al tema, no es la palabra. Si la dices tal cual sonará
            genérico: escucha a los demás y di algo más específico.
          </p>
        </>
      ) : (
        <p className="max-w-xs text-sm text-muted-foreground">
          No conoces la palabra. Escucha con atención, finge que la sabes y no te delates.
        </p>
      )}
    </>
  )
}

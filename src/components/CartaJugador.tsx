import { Fingerprint, Lock } from 'lucide-react'
import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Palabra, Rol } from '@/game/types'

interface CartaJugadorProps {
  rol: Rol
  palabra: Palabra
  onVista: () => void
}

/** Con mouse (escritorio) mantener presionado es incómodo; en pantallas táctiles es lo que protege la carta. */
function prefiereToque(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

/**
 * La carta secreta. El contenido va arriba y la zona para el dedo abajo, así la mano
 * nunca tapa el texto. Se muestra solo mientras el jugador mantiene presionada la zona.
 */
export function CartaJugador({ rol, palabra, onVista }: CartaJugadorProps) {
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
      <div
        aria-live="polite"
        className={cn(
          'flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border-2 p-6 text-center transition-colors duration-150',
          visible
            ? rol === 'impostor'
              ? 'border-impostor/60 bg-impostor/15'
              : 'border-civil/60 bg-civil/10'
            : 'border-dashed border-border bg-card/70',
        )}
      >
        {visible ? (
          rol === 'impostor' ? (
            <ContenidoImpostor palabra={palabra} />
          ) : (
            <ContenidoCivil palabra={palabra} />
          )
        ) : (
          <Lock className="size-10 text-muted-foreground" aria-label="Carta oculta" />
        )}
      </div>

      <button
        type="button"
        aria-pressed={visible}
        className={cn(
          'no-callout flex h-24 w-full items-center justify-center gap-3 rounded-3xl border-2 text-lg font-semibold transition-colors duration-150 outline-none focus-visible:ring-4 focus-visible:ring-ring/40',
          visible
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-primary/50 bg-primary/15 text-foreground active:bg-primary/30',
        )}
        onPointerDown={alPresionar}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onLostPointerCapture={alSoltar}
        onClick={alTocar}
        onKeyDown={alTeclear}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Fingerprint className="size-8" aria-hidden="true" />
        {modoToque
          ? visible
            ? 'Ocultar'
            : 'Ver mi carta'
          : visible
            ? 'Suelta para ocultar'
            : 'Mantén el dedo aquí'}
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
        {modoToque ? 'Cambiar a mantener presionado' : 'Cambiar a tocar'}
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
      <p className="font-heading text-4xl leading-tight font-extrabold text-balance sm:text-5xl">
        {palabra.texto}
      </p>
    </>
  )
}

function ContenidoImpostor({ palabra }: { palabra: Palabra }) {
  return (
    <>
      <p className="font-heading text-4xl leading-tight font-extrabold text-impostor sm:text-5xl">
        Eres el impostor
      </p>
      <div className="rounded-2xl bg-background/60 px-5 py-3">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Pista</p>
        <p className="font-heading text-2xl font-bold">{palabra.pista}</p>
      </div>
      <p className="text-sm text-muted-foreground">Escucha y no repitas la pista.</p>
    </>
  )
}

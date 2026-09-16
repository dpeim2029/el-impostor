import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PantallaProps {
  titulo?: string
  onAtras?: () => void
  accion?: ReactNode
  children: ReactNode
  pie?: ReactNode
  className?: string
}

/** Marco común: encabezado opcional, contenido con scroll y pie fijo con las acciones principales. */
export function Pantalla({ titulo, onAtras, accion, children, pie, className }: PantallaProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {(titulo || onAtras || accion) && (
        <header className="flex h-14 items-center gap-2 px-3">
          {onAtras ? (
            <Button variant="ghost" size="icon-lg" onClick={onAtras} aria-label="Regresar">
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <span className="size-9" />
          )}
          <h1 className="flex-1 truncate text-center text-base font-semibold">{titulo}</h1>
          <div className="flex size-9 items-center justify-end">{accion}</div>
        </header>
      )}
      <main
        className={cn(
          'flex flex-1 flex-col gap-4 px-4',
          pie ? 'pb-6' : 'pb-[max(env(safe-area-inset-bottom),1.5rem)]',
          className,
        )}
      >
        {children}
      </main>
      {pie && (
        <footer className="sticky bottom-0 border-t border-border/60 bg-background/85 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-md">
          <div className="flex flex-col gap-2">{pie}</div>
        </footer>
      )}
    </div>
  )
}

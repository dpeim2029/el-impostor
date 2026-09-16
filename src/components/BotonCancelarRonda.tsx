import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useJuego } from '@/game/JuegoContext'

/** Botón de salida del encabezado durante la ronda, con confirmación para no perderla por un toque accidental. */
export function BotonCancelarRonda() {
  const { dispatch } = useJuego()
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setAbierto(true)}
        aria-label="Cancelar ronda"
      >
        <X />
      </Button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>¿Cancelar esta ronda?</DialogTitle>
            <DialogDescription>
              Se descarta la palabra actual y regresan a los ajustes. Los jugadores se conservan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbierto(false)}>
              Seguir jugando
            </Button>
            <Button variant="destructive" onClick={() => dispatch({ tipo: 'cancelarRonda' })}>
              Cancelar ronda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

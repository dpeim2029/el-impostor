import { AvisoInstalarIOS } from '@/components/AvisoInstalarIOS'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'

export function Inicio() {
  const { dispatch } = useJuego()

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
    </Pantalla>
  )
}

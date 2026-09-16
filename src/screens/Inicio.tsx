import { BookOpen, Play, Users } from 'lucide-react'
import { AvisoInstalarIOS } from '@/components/AvisoInstalarIOS'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { categorias, totalPalabras } from '@/data/words'
import { useJuego } from '@/game/JuegoContext'

export function Inicio() {
  const { estado, dispatch } = useJuego()
  const hayJugadores = estado.jugadores.length > 0

  return (
    <Pantalla className="justify-center gap-8 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <span className="flex size-24 items-center justify-center rounded-[2rem] bg-impostor/15 text-6xl shadow-[0_0_60px_-10px] shadow-impostor/50">
            <span aria-hidden="true">🕵️</span>
          </span>
        </div>
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
            Juego de palabras
          </p>
          <h1 className="font-heading mt-1 text-5xl font-extrabold tracking-tight">El Impostor</h1>
        </div>
        <p className="max-w-xs text-balance text-muted-foreground">
          Todos conocen la palabra secreta menos uno. Descúbranlo antes de que se mezcle entre
          ustedes.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="h-14 text-lg font-semibold"
          onClick={() => dispatch({ tipo: 'ir', fase: 'ajustes' })}
        >
          <Play className="size-5" />
          {hayJugadores ? 'Jugar' : 'Nueva partida'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12"
          onClick={() => dispatch({ tipo: 'ir', fase: 'como-jugar' })}
        >
          <BookOpen className="size-5" />
          Cómo se juega
        </Button>
        {hayJugadores && (
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-4" aria-hidden="true" />
            {estado.jugadores.length} jugadores guardados:{' '}
            {estado.jugadores.map((j) => j.nombre).join(', ')}
          </p>
        )}
      </div>

      <AvisoInstalarIOS />

      <p className="text-center text-xs text-muted-foreground">
        {totalPalabras} palabras en {categorias.length} categorías · Sin anuncios · Funciona sin
        internet
      </p>
    </Pantalla>
  )
}

import { RefreshCw, Settings2 } from 'lucide-react'
import { Pantalla } from '@/components/Pantalla'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { impostoresDe, resolverVoto } from '@/game/engine'
import { useJuego } from '@/game/JuegoContext'
import { cn } from '@/lib/utils'

export function Resultado() {
  const { estado, dispatch } = useJuego()
  const { ronda, jugadores, ajustes } = estado
  if (!ronda) return null

  const porId = new Map(jugadores.map((j) => [j.id, j]))
  const nombre = (id: string) => porId.get(id)?.nombre ?? '—'
  const resultado = resolverVoto(ronda)
  const impostores = impostoresDe(ronda)
  const plural = impostores.length > 1

  return (
    <Pantalla
      titulo="Resultado"
      pie={
        <>
          <Button
            size="lg"
            className="h-14 text-lg font-semibold"
            onClick={() => dispatch({ tipo: 'otraRonda' })}
          >
            <RefreshCw className="size-5" />
            Otra ronda
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12"
            onClick={() => dispatch({ tipo: 'cancelarRonda' })}
          >
            <Settings2 className="size-4" />
            Cambiar jugadores o ajustes
          </Button>
        </>
      }
    >
      <div
        className={cn(
          'animate-in fade-in zoom-in-95 flex flex-col items-center gap-2 rounded-3xl border-2 p-6 text-center duration-300',
          resultado.ganaronCiviles
            ? 'border-civil/60 bg-civil/10'
            : 'border-impostor/60 bg-impostor/15',
        )}
      >
        <span className="text-6xl" aria-hidden="true">
          {resultado.ganaronCiviles ? '🎉' : '😈'}
        </span>
        <p
          className={cn(
            'font-heading text-3xl font-extrabold text-balance',
            resultado.ganaronCiviles ? 'text-civil' : 'text-impostor',
          )}
        >
          {resultado.ganaronCiviles
            ? plural
              ? '¡Atraparon a los impostores!'
              : '¡Atraparon al impostor!'
            : resultado.escapados.length === impostores.length && plural
              ? '¡Los impostores se escaparon!'
              : plural
                ? '¡Un impostor se escapó!'
                : '¡El impostor se escapó!'}
        </p>
        <p className="text-sm text-muted-foreground">
          {resultado.ganaronCiviles
            ? 'Ganan los civiles esta ronda.'
            : resultado.civilesAcusados.length > 0
              ? `Acusaron a ${resultado.civilesAcusados.map(nombre).join(' y ')} sin razón.`
              : 'Gana el bando impostor esta ronda.'}
        </p>
      </div>

      <section className="flex flex-col gap-2 rounded-2xl bg-card/70 p-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">La palabra era</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-heading text-3xl font-extrabold">{ronda.palabra.texto}</p>
          <Badge variant="outline" className="h-auto gap-1 px-2.5 py-1">
            <span aria-hidden="true">{ronda.palabra.categoriaEmoji}</span>
            {ronda.palabra.categoriaNombre}
          </Badge>
        </div>
        {ajustes.variantePista === 'pista-lejana' && (
          <p className="text-sm text-muted-foreground">
            {plural ? 'Los impostores vieron' : 'El impostor vio'} la pista lejana{' '}
            <strong className="text-foreground">«{ronda.palabra.pista}»</strong>.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2 rounded-2xl bg-card/70 p-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {plural ? 'Los impostores eran' : 'El impostor era'}
        </p>
        <ul className="flex flex-col gap-2">
          {impostores.map((id) => {
            const atrapado = resultado.atrapados.includes(id)
            return (
              <li key={id} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <span aria-hidden="true">🕵️</span>
                  {nombre(id)}
                </span>
                <Badge
                  className={cn(
                    'h-auto px-2.5 py-1',
                    atrapado ? 'bg-civil text-civil-foreground' : 'bg-impostor text-impostor-foreground',
                  )}
                >
                  {atrapado ? 'Atrapado' : 'Se escapó'}
                </Badge>
              </li>
            )
          })}
        </ul>
      </section>
    </Pantalla>
  )
}

import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { useJuego } from '@/game/JuegoContext'

const pasos = [
  'Pásense el teléfono. Cada quien ve su carta en secreto.',
  'Todos ven la misma palabra, menos el impostor.',
  'Por turnos, cada quien dice una palabra relacionada.',
  'El impostor solo tiene una pista lejana y debe fingir.',
  'Acusen a alguien. Si es el impostor, ganan.',
]

export function ComoJugar() {
  const { dispatch } = useJuego()

  return (
    <Pantalla
      titulo="Cómo se juega"
      onAtras={() => dispatch({ tipo: 'ir', fase: 'inicio' })}
      pie={
        <Button size="lg" className="h-14 text-lg font-semibold" onClick={() => dispatch({ tipo: 'ir', fase: 'ajustes' })}>
          Jugar
        </Button>
      }
    >
      <ol className="flex flex-col gap-2 pt-2">
        {pasos.map((paso, i) => (
          <li key={paso} className="flex items-center gap-3 rounded-2xl bg-card/70 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {i + 1}
            </span>
            <p className="text-base">{paso}</p>
          </li>
        ))}
      </ol>
      <p className="px-1 text-sm text-muted-foreground">
        Ejemplo: la palabra es <strong className="text-foreground">Pizza</strong>; el impostor
        solo ve <strong className="text-foreground">Italia</strong>.
      </p>
    </Pantalla>
  )
}

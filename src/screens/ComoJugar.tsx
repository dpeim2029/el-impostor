import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useJuego } from '@/game/JuegoContext'

const pasos = [
  {
    titulo: 'Repartan las cartas',
    texto:
      'Pásense el teléfono. Cada quien pone el dedo en el botón de abajo y su carta aparece arriba, en secreto: todos ven la misma palabra, menos el impostor.',
  },
  {
    titulo: 'Una palabra por turno',
    texto:
      'Empezando por quien indique el teléfono, cada jugador dice una sola palabra relacionada con la secreta. Ni la palabra ni algo tan obvio que la regale.',
  },
  {
    titulo: 'El impostor finge',
    texto:
      'No conoce la palabra, así que escucha, deduce y suelta algo que suene creíble. Pueden dar otra vuelta si hay dudas.',
  },
  {
    titulo: 'Acusen y revelen',
    texto:
      'Discutan, señalen al sospechoso y toquen su nombre. Si atrapan a todos los impostores, ganan los civiles; si uno se escapa, gana el impostor.',
  },
]

export function ComoJugar() {
  const { dispatch } = useJuego()
  const irAInicio = () => dispatch({ tipo: 'ir', fase: 'inicio' })

  return (
    <Pantalla
      titulo="Cómo se juega"
      onAtras={irAInicio}
      pie={
        <Button size="lg" className="h-12" onClick={() => dispatch({ tipo: 'ir', fase: 'ajustes' })}>
          Armar partida
        </Button>
      }
    >
      <ol className="flex flex-col gap-3">
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-3 rounded-2xl bg-card/70 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{paso.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle>Las dos variantes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div>
            <p className="font-semibold">Sin pista</p>
            <p className="text-muted-foreground">
              El impostor solo sabe que es el impostor. La versión clásica, más difícil para él.
            </p>
          </div>
          <div>
            <p className="font-semibold">Con pista lejana</p>
            <p className="text-muted-foreground">
              El impostor recibe una palabra que solo lo acerca al tema, no a la palabra. Por
              ejemplo, si la palabra es <em>Pizza</em>, su pista es <em>Italia</em>, no{' '}
              <em>Queso</em>. Y la misma pista sirve para varias palabras (Pizza, Lasaña,
              Espagueti), así que repetirla no lo salva: tiene que escuchar para saber cuál es.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reglas de la casa</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Una sola palabra por turno; no vale repetir la de alguien más.</li>
            <li>Siéntense en círculo: el orden de la lista es el orden en que están sentados.</li>
            <li>Con 6 o más jugadores pueden activar 2 impostores. No saben quién es el otro.</li>
            <li>Si atrapan a un civil por error, el impostor se escapa y gana la ronda.</li>
          </ul>
        </CardContent>
      </Card>
    </Pantalla>
  )
}

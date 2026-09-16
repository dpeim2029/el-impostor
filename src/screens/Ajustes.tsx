import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Pantalla } from '@/components/Pantalla'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { categorias, palabrasDeCategoria } from '@/data/words'
import { maxImpostores, validarPartida } from '@/game/engine'
import { useJuego } from '@/game/JuegoContext'
import { MAX_JUGADORES, MIN_JUGADORES, MIN_JUGADORES_DOS_IMPOSTORES, type Jugador } from '@/game/types'
import { cn } from '@/lib/utils'

export function Ajustes() {
  const { estado, dispatch } = useJuego()
  const { jugadores, ajustes } = estado
  const validacion = validarPartida(jugadores, ajustes)
  const permiteDos = maxImpostores(jugadores.length) === 2
  const lleno = jugadores.length >= MAX_JUGADORES

  return (
    <Pantalla
      titulo="Nueva partida"
      onAtras={() => dispatch({ tipo: 'ir', fase: 'inicio' })}
      pie={
        <>
          {!validacion.valido && jugadores.length > 0 && (
            <p className="text-center text-sm text-muted-foreground">{validacion.errores[0]}</p>
          )}
          <Button
            size="lg"
            className="h-14 text-lg font-semibold"
            disabled={!validacion.valido}
            onClick={() => dispatch({ tipo: 'repartir' })}
          >
            Repartir cartas
          </Button>
        </>
      }
    >
      <Seccion
        titulo="Jugadores"
        detalle={`${jugadores.length} de ${MAX_JUGADORES}`}
        ayuda={`Mínimo ${MIN_JUGADORES}. Acomódalos en el orden en que están sentados.`}
      >
        <FormularioJugador
          deshabilitado={lleno}
          onAgregar={(nombre) => dispatch({ tipo: 'agregarJugador', nombre })}
        />
        {jugadores.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            Todavía no hay nadie. Escribe un nombre y toca “+”.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {jugadores.map((jugador, i) => (
              <FilaJugador
                key={jugador.id}
                jugador={jugador}
                posicion={i + 1}
                esPrimero={i === 0}
                esUltimo={i === jugadores.length - 1}
                onRenombrar={(nombre) => dispatch({ tipo: 'renombrarJugador', id: jugador.id, nombre })}
                onMover={(direccion) => dispatch({ tipo: 'moverJugador', id: jugador.id, direccion })}
                onQuitar={() => dispatch({ tipo: 'quitarJugador', id: jugador.id })}
              />
            ))}
          </ul>
        )}
      </Seccion>

      <Seccion titulo="Impostores">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Número de impostores">
          {([1, 2] as const).map((n) => {
            const deshabilitado = n === 2 && !permiteDos
            const activo = ajustes.numImpostores === n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={activo}
                disabled={deshabilitado}
                onClick={() => dispatch({ tipo: 'setNumImpostores', numImpostores: n })}
                className={cn(
                  'flex h-12 items-center justify-center gap-2 rounded-2xl border text-base font-semibold transition-colors',
                  activo
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card/70 hover:bg-card',
                  deshabilitado && 'cursor-not-allowed opacity-40',
                )}
              >
                {n === 1 ? '1 impostor' : '2 impostores'}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {permiteDos
            ? 'Con 2 impostores el grupo hace 2 acusaciones. Los impostores no saben quién es el otro.'
            : `Para 2 impostores se necesitan ${MIN_JUGADORES_DOS_IMPOSTORES} jugadores o más.`}
        </p>
      </Seccion>

      <Seccion titulo="Variante">
        <label className="flex items-center justify-between gap-4 rounded-2xl bg-card/70 p-4">
          <span>
            <span className="block font-semibold">Pista lejana para el impostor</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {ajustes.variantePista === 'pista-lejana'
                ? 'El impostor ve una palabra que solo lo acerca al tema, nunca la palabra.'
                : 'Sin pista: el impostor entra a ciegas. La variante clásica.'}
            </span>
          </span>
          <Switch
            checked={ajustes.variantePista === 'pista-lejana'}
            onCheckedChange={(activa) =>
              dispatch({ tipo: 'setVariantePista', variantePista: activa ? 'pista-lejana' : 'sin-pista' })
            }
            aria-label="Pista lejana para el impostor"
          />
        </label>
      </Seccion>

      <Seccion
        titulo="Categorías"
        detalle={`${ajustes.categoriasActivas.length} de ${categorias.length}`}
        accion={
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => dispatch({ tipo: 'setCategorias', ids: categorias.map((c) => c.id) })}
            >
              Todas
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => dispatch({ tipo: 'setCategorias', ids: [] })}
            >
              Ninguna
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {categorias.map((categoria) => {
            const activa = ajustes.categoriasActivas.includes(categoria.id)
            return (
              <button
                key={categoria.id}
                type="button"
                aria-pressed={activa}
                onClick={() => dispatch({ tipo: 'toggleCategoria', id: categoria.id })}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border p-3 text-left transition-colors',
                  activa
                    ? 'border-primary/60 bg-primary/15'
                    : 'border-border bg-card/40 text-muted-foreground',
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {categoria.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{categoria.nombre}</span>
                  <span className="block text-xs text-muted-foreground">
                    {palabrasDeCategoria(categoria).length} palabras
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </Seccion>
    </Pantalla>
  )
}

function Seccion({
  titulo,
  detalle,
  ayuda,
  accion,
  children,
}: {
  titulo: string
  detalle?: string
  ayuda?: string
  accion?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">
          {titulo}
          {detalle && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">{detalle}</span>
          )}
        </h2>
        {accion}
      </div>
      {ayuda && <p className="-mt-2 text-sm text-muted-foreground">{ayuda}</p>}
      {children}
    </section>
  )
}

function FormularioJugador({
  deshabilitado,
  onAgregar,
}: {
  deshabilitado: boolean
  onAgregar: (nombre: string) => void
}) {
  const [nombre, setNombre] = useState('')

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
    if (!nombre.trim()) return
    onAgregar(nombre)
    setNombre('')
  }

  return (
    <form onSubmit={enviar} className="flex gap-2">
      <Label htmlFor="nuevo-jugador" className="sr-only">
        Nombre del jugador
      </Label>
      <Input
        id="nuevo-jugador"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder={deshabilitado ? 'Ya están todos' : 'Nombre del jugador'}
        disabled={deshabilitado}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="done"
        maxLength={20}
        className="h-12 rounded-2xl text-base"
      />
      <Button
        type="submit"
        size="icon-lg"
        className="size-12 rounded-2xl"
        disabled={deshabilitado || !nombre.trim()}
        aria-label="Agregar jugador"
      >
        <Plus className="size-5" />
      </Button>
    </form>
  )
}

function FilaJugador({
  jugador,
  posicion,
  esPrimero,
  esUltimo,
  onRenombrar,
  onMover,
  onQuitar,
}: {
  jugador: Jugador
  posicion: number
  esPrimero: boolean
  esUltimo: boolean
  onRenombrar: (nombre: string) => void
  onMover: (direccion: -1 | 1) => void
  onQuitar: () => void
}) {
  const [editando, setEditando] = useState(false)
  const [borrador, setBorrador] = useState(jugador.nombre)

  const guardar = () => {
    setEditando(false)
    if (borrador.trim() && borrador.trim() !== jugador.nombre) onRenombrar(borrador)
    else setBorrador(jugador.nombre)
  }

  return (
    <li className="flex items-center gap-2 rounded-2xl bg-card/70 py-1.5 pr-1.5 pl-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
        {posicion}
      </span>
      {editando ? (
        <Input
          autoFocus
          value={borrador}
          maxLength={20}
          onChange={(e) => setBorrador(e.target.value)}
          onBlur={guardar}
          onKeyDown={(e) => {
            if (e.key === 'Enter') guardar()
            if (e.key === 'Escape') {
              setBorrador(jugador.nombre)
              setEditando(false)
            }
          }}
          className="h-9 flex-1"
          aria-label="Editar nombre"
        />
      ) : (
        <button
          type="button"
          className="flex-1 truncate py-2 text-left font-medium"
          onClick={() => setEditando(true)}
          title="Tocar para editar"
        >
          {jugador.nombre}
        </button>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={esPrimero}
        onClick={() => onMover(-1)}
        aria-label={`Subir a ${jugador.nombre}`}
      >
        <ChevronUp />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={esUltimo}
        onClick={() => onMover(1)}
        aria-label={`Bajar a ${jugador.nombre}`}
      >
        <ChevronDown />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-destructive"
        onClick={onQuitar}
        aria-label={`Quitar a ${jugador.nombre}`}
      >
        <X />
      </Button>
    </li>
  )
}

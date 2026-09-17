# El Impostor

**Juega aquí: https://dpeim2029.github.io/el-impostor/** (en el iPhone: Compartir → Agregar a
pantalla de inicio). Cada push a `main` se publica solo con GitHub Pages.

Juego de palabras para jugar en familia pasando un solo teléfono. Es una versión libre de
"Imposter Who?" sin anuncios, sin pagos y sin categorías bloqueadas, pensada para instalarse en
el iPhone como app (PWA) y funcionar sin internet.

**Cómo se juega:** todos los jugadores ven la misma palabra secreta menos uno (o dos), el
impostor. Por turnos, cada quien dice una palabra relacionada; el impostor tiene que fingir que
la conoce. Al final el grupo acusa y se revela quién era.

## La diferencia: la pista lejana

En el original, cuando el impostor recibe pista, es una palabra tan directa que basta repetirla
para pasar desapercibido. Aquí cada palabra trae una **pista lejana** escrita a mano que sigue
tres reglas:

1. No es algo que un civil diría como pista (ni sinónimo, ni ingrediente, ni adjetivo típico).
2. Está a dos saltos: origen, contexto, oficio relacionado, lugar donde ocurre.
   Pizza → _Italia_ (no _Queso_). Escoba → _Cenicienta_. Brócoli → _Berrinche_.
3. La misma pista sirve para 2 o más palabras de la categoría (_Italia_ → Pizza, Lasaña,
   Espagueti). El impostor sabe el "barrio", pero tiene que escuchar para saber cuál es.

Un test automático (`src/data/words.test.ts`) exige estas reglas: cada pista la comparten al
menos dos palabras, ninguna pista es igual a su palabra ni la contiene, y ninguna pista es otra
palabra de la misma categoría.

## Funciones

- 3 a 15 jugadores con nombre; el orden de la lista es el orden en que están sentados.
- 1 impostor, o 2 con 6+ jugadores (no saben quién es el otro; el grupo hace 2 acusaciones).
- El impostor siempre recibe una pista lejana.
- 12 categorías y ~700 palabras en español de México, aptas para niños. Todas activas por
  defecto; un switch permite elegir solo algunas.
- No se repiten palabras entre rondas hasta agotar la categoría.
- La carta se ve solo mientras se mantiene presionada; se oculta al soltar.
- Jugadores, ajustes y ronda en curso se guardan en el teléfono (sobrevive a recargas).
- Sin servidor ni cuentas: todo corre en el navegador.

## Correr en local

Requiere Node 22+ y [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://127.0.0.1:4517
pnpm test       # vitest: banco de palabras, engine y store
pnpm lint       # oxlint
pnpm build      # genera dist/ con el service worker
pnpm preview    # sirve dist/ en http://127.0.0.1:4517
```

## Instalar en el iPhone

1. Abre https://dpeim2029.github.io/el-impostor/ en Safari.
2. Toca **Compartir → Agregar a pantalla de inicio**.

Desde ahí se abre a pantalla completa, con icono propio y sin conexión.

## Publicación

El workflow `.github/workflows/pages.yml` corre en cada push a `main`: instala, prueba,
construye con `VITE_BASE=/el-impostor/` y despliega a GitHub Pages. Para publicar en otro
hosting estático (Netlify, Vercel, Cloudflare Pages) basta subir `dist/`; si va en la raíz del
dominio no hace falta `VITE_BASE`. El service worker requiere HTTPS.

## Agregar palabras

Las categorías viven en `src/data/words/*.ts`. Cada categoría es una lista de grupos: una pista
lejana y las palabras que la comparten.

```ts
{ pista: 'Italia', palabras: ['Pizza', 'Espagueti', 'Lasaña'] }
```

Agrega la palabra a un grupo existente o crea uno nuevo con al menos dos palabras, y corre
`pnpm test` para comprobar que la pista cumple las reglas. Para una categoría nueva, crea el
archivo, expórtalo y súmalo a la lista en `src/data/words/index.ts`.

## Estructura

```
src/
  data/words/        Banco de palabras (un archivo por categoría) y validación
  game/
    types.ts         Tipos del dominio
    engine.ts        Funciones puras: palabra, roles, orden, voto, validación
    store.ts         Reducer, acciones y persistencia en localStorage
    JuegoProvider.tsx / JuegoContext.tsx
  screens/           Inicio, ComoJugar, Ajustes, Reparto, Ronda, Votacion, Resultado
  components/        Pantalla, CartaJugador, BotonCancelarRonda, AvisoInstalarIOS, ui/ (shadcn)
  hooks/useWakeLock.ts
```

Stack: Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, vite-plugin-pwa, Vitest.

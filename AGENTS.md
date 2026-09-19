# El Impostor — contexto para agentes

Lee este archivo completo antes de tocar nada. Resume las decisiones tomadas con el dueño del
proyecto (Daniel) y el estado actual. El README cubre solo la versión web.

## Qué es

Juego de deducción social para fiestas/familia, tipo "Imposter Who?" (Sokak). Todos los
jugadores ven la misma palabra secreta menos uno o dos (impostores). Por turnos cada quien dice
**una** palabra relacionada; el impostor finge. Al final acusan y se revela.

Motivo de existir: el original cobra suscripción y tiene anuncios, y su pista para el impostor
es tan directa que basta repetirla. Este juego es **gratis, sin anuncios** y la pista es
**lejana** (ver abajo). Público: familias con niños, español de México primero.

## Estado actual del repo

- **Web app (React + Vite + Tailwind v4 + shadcn/ui), PWA, modo "pasar el teléfono".**
  Publicada en https://dpeim2029.github.io/el-impostor/ vía `.github/workflows/pages.yml`
  (cada push a `main` despliega). Repo: https://github.com/dpeim2029/el-impostor.
- 98 tests en verde (`pnpm test`). Lint con oxlint. Sin backend, sin cuentas.
- **Banco de palabras**: `src/data/words/*.ts` (fuente) y `data/words.es-MX.json` (export para
  otros clientes; regenerar con `pnpm words:export` tras editar la fuente).
- **App iOS nativa (SwiftUI) en `ios/`**, funcional de punta a punta en el simulador; ver la
  sección "Cliente iOS" abajo. Aún sin cuenta de Apple Developer (en trámite, sep-2026).
- Política de privacidad pública en `public/privacidad.html` (la pide App Store Connect).

## Reglas de juego (decididas, no cambiar sin preguntar)

- 3 a 15 jugadores con nombre. El orden de la lista = orden en que están sentados. Se guardan
  entre sesiones.
- 1 impostor por defecto; **2 impostores solo con 6+ jugadores**. Los impostores **no** saben
  quién es el otro. Con 2, el grupo hace 2 acusaciones; los civiles ganan solo si atrapan a
  **todos**.
- **Con pistas / Sin pistas** se elige en la pantalla de inicio (segmented control) y se
  recuerda. Con pistas: el impostor ve la pista lejana. Sin pistas: solo "Eres el impostor".
- El impostor **nunca ve la categoría ni la palabra**. Los civiles ven palabra + categoría.
- Categorías: **todas activas por defecto**; un switch abre la selección individual. Sin switch
  visible de pista en ajustes.
- La ronda empieza con un jugador al azar y sigue el orden de asientos. "Otra vuelta" repite la
  ronda de palabras antes de votar.
- Votación en grupo: quien tiene el teléfono toca al acusado, confirma, y se revela al instante
  si era impostor o civil.
- **No se repiten palabras** entre rondas hasta agotar las categorías activas; luego se reinicia
  solo ese subconjunto.
- Resultado muestra: quién ganó, la palabra + categoría, la pista (solo si estaba en modo con
  pistas), y cada impostor con "Atrapado" / "Se escapó".

## La pista lejana (corazón del producto)

Cada palabra pertenece a un **grupo** con una pista compartida. Reglas, verificadas por
`src/data/words.test.ts`:

1. No es algo que un civil diría como pista: ni sinónimo, ni ingrediente/parte, ni adjetivo
   típico. Pizza → *Italia*, no *Queso*.
2. Está a dos saltos: origen, contexto, época, oficio relacionado, lugar donde ocurre.
   Escoba → *Cenicienta*. Bombero → *Sirena*. Brócoli → *Berrinche*.
3. **La misma pista la comparten 2 o más palabras** del grupo (*Italia* → Pizza, Lasaña,
   Espagueti). El impostor sabe el "barrio" pero tiene que escuchar para saber cuál es; repetir
   la pista suena genérico y no lo salva.
4. La pista no es igual a la palabra, no la contiene, no está contenida en ella (con plurales
   simples y acentos normalizados), y no es otra palabra de la misma categoría.

Al crear un banco en otro idioma **no se traduce, se recrea**: las pistas son culturales
(Posadas → *Vela*, Día de Muertos → *Coco*). Mantener las mismas reglas y tests.

Formato JSON (`data/words.es-MX.json`):

```json
{ "idioma": "es-MX", "categorias": [
  { "id": "comida", "nombre": "Comida", "emoji": "🌮",
    "grupos": [ { "pista": "Italia", "palabras": ["Pizza", "Espagueti", "Lasaña"] } ] } ] }
```

## Decisiones de UX (estilo app nativa de iPhone, mínimo texto)

- Tema oscuro único; acento ámbar; rojo para impostor, verde para civil.
- Inicio: icono, título, una frase, selector Con/Sin pistas, botón **Jugar**, enlace "Cómo se
  juega". Nada más.
- Reparto de cartas: "Pásale el teléfono a {nombre}", panel superior con la carta (oculto = solo
  un candado) y un **botón grande abajo "Mantén el dedo aquí"**: la carta se ve solo mientras se
  mantiene presionado y se oculta al soltar. **El texto siempre queda arriba del dedo.** No hay
  enlaces ni textos grises debajo del botón. El botón "Pasar el teléfono" se habilita solo tras
  ver la carta. Con mouse (escritorio) el botón es de tocar para mostrar/ocultar.
- Textos cortos y sin explicaciones largas en ninguna pantalla. Botones de 56 pt para la acción
  principal.
- Mantener la pantalla encendida durante la partida.
- Todo en español de México; "tú"/"ustedes", nunca "vosotros".

## Plan acordado hacia adelante

Objetivo declarado por Daniel: **llegar a la mayor cantidad de personas posible, con la mejor
experiencia Apple, en varios idiomas**. Decisiones:

1. **App iOS nativa en SwiftUI** (no Capacitor). Daniel tiene Mac y usará Xcode + Claude Code.
   Bundle ID neutro (p. ej. `mx.elimpostor.app`); no ligarlo a un nombre personal porque la app
   se transferirá después a una cuenta de empresa.
2. **Modo online**: cada jugador en su propio iPhone (o navegador). Servidor de salas planeado en
   **Cloudflare Workers + Durable Objects** (WebSockets). El servidor manda a cada jugador solo su
   carta. Código de sala de 4 letras + link para WhatsApp. Reconexión al volver del segundo
   plano. Voto secreto. El modo "pasar el teléfono" se conserva.
3. **El engine vive en el servidor** (reglas, banco, roles, orden, voto); los clientes pintan.
   Referencia de la lógica: `src/game/engine.ts` y sus tests. Es código puro, fácil de portar.
4. **La web sigue viva** como landing e invitación para quien no tiene la app, y como base para
   Android (Capacitor) después.
5. **Idiomas**: es-MX (hecho) → en → es-ES → pt-BR → fr/de/it. Interfaz con String Catalogs;
   banco de palabras por idioma con revisión de hablante nativo. Metadatos de App Store
   localizados por país.
6. **Monetización**: gratis, **sin anuncios, siempre**. Un solo IAP no consumible (paquete de
   íconos alternos + extras), con grandfathering vía `AppTransaction.originalAppVersion`.
   Nunca poner candado al juego base.
7. **Dominio**: pendiente de compra. Libres al 17-sep-2026: `elimpostor.mx`, `impostor.mx`,
   `impostor.party`, `impostor.club`, `getimpostor.com`, `impostorio.com`. Necesario para
   Universal Links (archivo `apple-app-site-association`; incluye el Team ID, actualizar al
   transferir la app).
8. **Cuenta de desarrollador**: arrancar como persona física y transferir a la empresa después
   (App Transfer conserva usuarios, reseñas y compras). Nombre de la app: distinto de "Imposter
   Who?" y de cualquier combinación cercana (reglas 4.1 y 5.2); lo genérico va en el subtítulo.

## Cliente iOS (SwiftUI) — estado y cómo trabajarlo

Todo vive en `ios/`. El `.xcodeproj` **no se versiona**: se genera con XcodeGen desde
`ios/project.yml` (`xcodegen generate --spec ios/project.yml --project ios`).

- **`ios/ImpostorCore/`**: paquete SwiftPM con el motor, solo Foundation (sin UIKit/SwiftUI para
  reutilizarlo en el servidor). Espejo 1:1 de `src/game/*.ts` con identificadores en español:
  `Tipos`, `Aleatorio` (RNG inyectable; `LCG` usa la fórmula de los tests web), `BancoPalabras`,
  `Motor`, `Reductor` (enum `Accion` + `reducir(_:_:contexto:)`), `Persistencia` (clave
  `el-impostor:v1`, **mismo JSON que la web**, lectura tolerante). 50 tests con Swift Testing que
  copian los nombres de los tests TS. `swift test --package-path ios/ImpostorCore` corre en segundos.
- **`ios/ElImpostor/`**: app. `JuegoStore` (`@Observable`, MainActor) envuelve el reductor y guarda
  en UserDefaults tras cada acción. `RaizView` hace `switch fase` (sin NavigationStack).
  `Pantalla` es el marco común (cabecera 56 pt, contenido, pie con Liquid Glass). Estilos en
  `Design/` (`.primario` 56 pt ámbar, `.secundario` 48 pt, tarjetas, `LogoImpostor` vectorial).
  `CartaJugadorView` implementa el gesto de mantener con `DragGesture(minimumDistance: 0)` y se
  oculta al perder foco. Tipografía SF Rounded escalada con Dynamic Type (tope accessibility2).
  Textos como `LocalizedStringKey` literales en español; catálogo `Localizable.xcstrings` base es-MX.
- **Ícono**: `Resources/AppIcon.icon` (Icon Composer, Liquid Glass, capas SVG sombrero + lentes)
  y `AppIcon.appiconset` con PNG 1024 de respaldo. Fuente vectorial: `public/favicon.svg`.
- **Banco de palabras**: la app referencia `../data/words.es-MX.json` como recurso; no se copia.
- **Verificación solo por CLI** (Xcode 27 ya no trae Simulator.app; el panel de simulador de
  Claude Code Desktop no lo soporta): `xcodebuild test` (unit + UI) y `ios/scripts/capturas.sh`,
  que siembra estados en UserDefaults del contenedor y captura las 10 pantallas. Argumentos de
  depuración (solo Debug): `--reiniciar`, `--fase <inicio|como-jugar|ajustes>`, `--mostrar-carta`.
- **UI tests** (`ElImpostorUITests/FlujoUITests`): partida completa con el gesto, cancelar ronda,
  persistencia al relanzar. Los identificadores de accesibilidad son la API de los tests.
- **Gotchas**: el vidrio (`glassEffect`) ignora `.opacity` del ancestro, por eso el estado
  deshabilitado cambia colores y quita el vidrio. `UserDefaults` no es `Sendable` en el SDK 27
  (`@unchecked`). El target de UI tests necesita `SWIFT_DEFAULT_ACTOR_ISOLATION = nonisolated`.
  `xcode-select` debe apuntar a Xcode (`sudo xcode-select -s /Applications/Xcode.app`) o exportar
  `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`.
- **Pendiente para publicar**: cuenta Apple Developer → `DEVELOPMENT_TEAM` en `project.yml`,
  Bundle ID `mx.elimpostor.app` y ficha en App Store Connect, capturas 6.9", TestFlight.
  CI: `.github/workflows/ios.yml` (runner macOS, XcodeGen + swift test + xcodebuild test).

## Comandos web

```bash
pnpm install && pnpm dev     # http://127.0.0.1:4517
pnpm test && pnpm lint && pnpm build
pnpm words:export            # regenera data/words.es-MX.json
```

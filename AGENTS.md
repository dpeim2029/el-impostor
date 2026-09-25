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
- 181 tests en verde (`pnpm test`). Lint con oxlint. Sin backend, sin cuentas.
- **Bancos de palabras**: español en `src/data/words/*.ts` (neutro para todos los países
  hispanohablantes + categoría regional "México") e inglés internacional en `src/data/words-en/*.ts`
  (+ categoría regional "USA"). Exports para otros clientes: `data/words.es-MX.json` y
  `data/words.en.json` (regenerar con `pnpm words:export`). Una categoría con `regiones` viene
  activa por defecto solo en esas regiones; `categoriasConocidas` en los ajustes guardados permite
  activar categorías nuevas a quien ya jugaba (ver `IDS_BANCO_V1`).
- **App iOS nativa (SwiftUI) en `ios/`**, en beta pública de TestFlight desde el 23-sep-2026; ver
  las secciones "Cliente iOS" y "Publicación" abajo.
- Páginas públicas que pide App Store Connect: `public/privacidad.html` y `public/soporte.html`
  (contacto: daniel_peimbert@hotmail.com).
- Crédito "Hecho por @danielpeimbert" (link a https://x.com/danielpeimbert) al pie del inicio en
  iOS y web, y en soporte/privacidad.

## Reglas de juego (decididas, no cambiar sin preguntar)

- 3 a 15 jugadores con nombre. El orden de la lista = orden en que están sentados. Se guardan
  entre sesiones.
- 1 impostor por defecto; **2 impostores solo con 6+ jugadores**. Los impostores **no** saben
  quién es el otro. Con 2, el grupo hace 2 acusaciones; los civiles ganan solo si atrapan a
  **todos**.
- **Con pistas / Sin pistas** se elige en la pantalla de inicio (segmented control) y se
  recuerda. Con pistas: el impostor ve la pista lejana. Sin pistas: solo "Eres el impostor".
- El impostor **nunca ve la categoría ni la palabra**. Los civiles ven palabra + categoría.
- Categorías: **todas activas por defecto**, salvo las regionales, que solo vienen activas en su
  país ("México" en MX, "USA" en EE. UU.); un switch abre la selección individual. Sin switch
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
(Día de Muertos → *Coco*). Mantener las mismas reglas y tests (`words.test.ts` corre las reglas
sobre todos los bancos). Cada banco evita palabras que cambian de significado o de nombre entre
países del mismo idioma (torta, tuna, alberca; football, chips, cookie) y deja la cultura de un
solo país en una categoría regional.

Formato JSON (`data/words.es-MX.json`):

```json
{ "idioma": "es-MX", "categorias": [
  { "id": "comida", "nombre": "Comida", "emoji": "🌮",
    "grupos": [ { "pista": "Italia", "palabras": ["Pizza", "Espagueti", "Lasaña"] } ] } ] }
```

## Decisiones de UX (diseño "Papel + nativo", decidido el 19-sep-2026)

Daniel descartó el tema oscuro con ámbar y resplandores ("se ve muy IA"). El diseño vigente,
implementado en la app iOS (la web todavía tiene el diseño anterior):

- **Tema claro único**: fondo papel `#F5F4F0`, tinta `#111`, tipografía SF Pro en pesos fuertes;
  títulos y nombres en **mayúsculas** ("EL IMPOSTOR", "ANA"). Sin degradados ni brillos. Botón
  principal: cápsula negra de 56 pt. Sin acento de color en la interfaz base.
- **Elementos nativos de iOS**: Nueva partida es una lista agrupada (título grande, asas para
  reordenar con Editar, deslizar para quitar, fila verde "Agregar jugador", control segmentado,
  interruptor). "Cómo se juega" es una hoja con asa sobre el inicio. Acusación y resultado son
  **tarjetas modales sobre fondo difuminado** (ícono en un tile de color, título, subtítulo,
  botones). Botones circulares de vidrio (iOS 26) para regresar y cancelar.
- **La carta secreta (cartas H1)**: un **sobre blanco cerrado, idéntico para todos**, con "Solo
  para {nombre}". Al mantener el dedo, el resto de la pantalla se difumina y la carta se abre:
  **menta** con ojo, la palabra grande y la categoría en pastilla (civil); **coral** con el
  sombrero rojo, "ERES EL IMPOSTOR" y la pastilla "Pista: {pista}" (impostor). Sin frases extra:
  Daniel prefirió claridad inmediata para personas mayores por encima de la discreción de reojo
  (se evaluaron variantes neutras; quedan como posible ajuste futuro "cartas discretas").
- Reparto: "Pasa el teléfono a {NOMBRE}", carta, zona de 84 pt "Mantén el dedo aquí" abajo;
  **el texto siempre queda arriba del dedo**; "Pasar el teléfono" se habilita tras ver la carta.
- Color por rol solo en momentos públicos: verde `#1F9E6E` (civil, atrapado) y rojo `#E5484D`
  (impostor, se escapó).
- **Toques "Papel y stickers" (mezcla J1, definitiva el 19-sep-2026)**: marcador amarillo girado
  detrás de "IMPOSTOR" en el inicio y del nombre de quien empieza; títulos de cabecera de las
  pantallas de juego como pastilla amarilla girada ("1 de 4", "Ronda", "Votación"); en Nueva
  partida cada sección va en un marco pastel (lila jugadores, durazno impostores, amarillo
  categorías) con filas blancas adentro (`FondoDeSeccion` como `listRowBackground`); números de
  las instrucciones como calcomanías de colores giradas; la lista de la ronda en marco cielo y
  la de votación en marco durazno (`MarcoDeColor` + `GrupoBlanco(radio: 16)`); el sobre cerrado
  lleva la calcomanía "SOLO PARA {NOMBRE}"; en las modales el veredicto lleva marcador menta o
  coral y los detalles del resultado van en marco amarillo. Colores en `Design/Stickers.swift`.
- Ícono (decidido el 23-sep-2026): las tres cartas de la ilustración (dos amarillas con caras
  riendo y una blanca con sombrero y lentes) al 90 % sobre **azul noche liso `#1B2440`**, sin
  confeti ni rayos (reemplazó al fondo morado con confeti del 20-sep). Iguales en iOS y web.
- Textos cortos; "tú"/"ustedes", nunca "vosotros". Mantener la pantalla encendida en la partida.

## Plan acordado hacia adelante

Objetivo declarado por Daniel: **llegar a la mayor cantidad de personas posible, con la mejor
experiencia Apple, en varios idiomas**. Desde el 23-sep-2026 el proyecto **no busca
monetizarse**: es una muestra pública de cómo Daniel aplica IA a un proyecto real, con crédito a
su perfil de X. Eso cambió los puntos 1, 6 y 8. Decisiones:

1. **App iOS nativa en SwiftUI** (no Capacitor). Daniel tiene Mac y usará Xcode + Claude Code.
   Bundle ID `mx.elimpostor.app`. La app se queda en la cuenta personal de Daniel.
2. **Modo online**: cada jugador en su propio iPhone (o navegador). Servidor de salas planeado en
   **Cloudflare Workers + Durable Objects** (WebSockets). El servidor manda a cada jugador solo su
   carta. Código de sala de 4 letras + link para WhatsApp. Reconexión al volver del segundo
   plano. Voto secreto. El modo "pasar el teléfono" se conserva.
3. **El engine vive en el servidor** (reglas, banco, roles, orden, voto); los clientes pintan.
   Referencia de la lógica: `src/game/engine.ts` y sus tests. Es código puro, fácil de portar.
4. **La web sigue viva** como landing e invitación para quien no tiene la app, y como base para
   Android (Capacitor) después.
5. **Idiomas**: español neutro para todos los países hispanohablantes + inglés internacional
   (ambos en la 1.1) → pt-BR → fr/de/it. Interfaz con String Catalogs; banco de palabras por
   idioma con revisión de hablante nativo. Metadatos de App Store localizados por país. Un iPhone
   sin español ni inglés en su lista de idiomas ve la app en español (región de desarrollo es-MX):
   revisarlo antes de abrir países de otros idiomas.
6. **Sin monetización**: gratis, **sin anuncios ni compras dentro de la app**. Se descartó el IAP
   de íconos alternos.
7. **Dominio**: pendiente de compra. Libres al 17-sep-2026: `elimpostor.mx`, `impostor.mx`,
   `impostor.party`, `impostor.club`, `getimpostor.com`, `impostorio.com`. Necesario para
   Universal Links (archivo `apple-app-site-association`; incluye el Team ID).
8. **Cuenta de desarrollador**: persona física de Daniel (Team ID `976FLL49MH`, vendedor "Daniel
   Peimbert Davalos"); ya no se planea transferir a una empresa. Nombre de la app: distinto de
   "Imposter Who?" y de cualquier combinación cercana (reglas 4.1 y 5.2); lo genérico va en el
   subtítulo. En la tienda es "El Impostor: Palabras"; en el iPhone, "El Impostor".

## Cliente iOS (SwiftUI) — estado y cómo trabajarlo

Todo vive en `ios/`. El `.xcodeproj` **no se versiona**: se genera con XcodeGen desde
`ios/project.yml` (`xcodegen generate --spec ios/project.yml --project ios`).

- **`ios/ImpostorCore/`**: paquete SwiftPM con el motor, solo Foundation (sin UIKit/SwiftUI para
  reutilizarlo en el servidor). Espejo 1:1 de `src/game/*.ts` con identificadores en español:
  `Tipos`, `Aleatorio` (RNG inyectable; `LCG` usa la fórmula de los tests web), `BancoPalabras`,
  `Motor`, `Reductor` (enum `Accion` + `reducir(_:_:contexto:)`), `Persistencia` (clave
  `el-impostor:v1`, **mismo JSON que la web**, lectura tolerante). 56 tests con Swift Testing que
  copian los nombres de los tests TS. `swift test --package-path ios/ImpostorCore` corre en segundos.
- **`ios/ElImpostor/`**: app. `JuegoStore` (`@Observable`, MainActor) envuelve el reductor y guarda
  en UserDefaults tras cada acción. `RaizView` hace `switch fase` (sin NavigationStack).
  `Pantalla` es el marco común (cabecera 56 pt, contenido, pie). Estilos en `Design/`
  (`.primario` cápsula negra 56 pt, `.borde`, `.secundario`, tarjetas blancas, `LogoImpostor`).
  `TarjetaModal` + `ModalSobreFondo` para acusación y resultado; `AjustesView` usa `List` nativa.
  `CartaJugadorView` implementa el gesto de mantener con `DragGesture(minimumDistance: 0)` y se
  oculta al perder foco. Tipografía SF Pro escalada con Dynamic Type (tope accessibility2).
  Textos como `LocalizedStringKey` literales en español; catálogos `Localizable.xcstrings` e
  `InfoPlist.xcstrings` con base es-MX y traducción `en` (nombre en el iPhone: "The Impostor").
  El banco sigue al idioma en que iOS muestra la app (`Bundle.main.preferredLocalizations`): "en"
  carga `words.en.json`, cualquier otro `words.es-MX.json`. `JuegoStore.idsPorDefecto` = categorías
  sin elegir para la región (el interruptor "Elegir categorías" se compara contra eso).
  Para traducir: `xcodebuild -exportLocalizations ... -exportLanguage en`, llenar el XLIFF y
  `-importLocalizations`.
- **Ícono**: `Resources/AppIcon.icon` (Icon Composer) = relleno azul noche en `icon.json` + una capa
  `Assets/cartas.png` (cartas con sombra horneada, fondo transparente; sin vidrio). Al ir en capas,
  iOS 26 genera bien las variantes oscura y con tinte. `ios/scripts/icono.py` compone desde esa capa
  el PNG 1024 opaco de `AppIcon.appiconset` y los íconos de `public/` (favicon, apple-touch, PWA).
- **Bancos de palabras**: la app referencia `../data/words.es-MX.json` y `../data/words.en.json` como
  recursos; no se copian.
- **Verificación solo por CLI** (Xcode 27 ya no trae Simulator.app; el panel de simulador de
  Claude Code Desktop no lo soporta): `xcodebuild test` (unit + UI) y `ios/scripts/capturas.sh`,
  que siembra estados en UserDefaults del contenedor y captura las 10 pantallas (tercer argumento:
  `es-MX` o `en`, con jugadores y palabra de ejemplo en ese idioma). Argumentos de
  depuración (solo Debug): `--reiniciar`, `--fase <inicio|como-jugar|ajustes>`, `--mostrar-carta`.
- **UI tests** (`ElImpostorUITests/FlujoUITests`): partida completa con el gesto, cancelar ronda,
  persistencia al relanzar. Los identificadores de accesibilidad son la API de los tests.
  Se lanzan con `-AppleLanguages (es-MX)` porque buscan textos en español y el simulador está en inglés.
- **Gotchas**: el vidrio (`glassEffect`) ignora `.opacity` del ancestro. Un
  `accessibilityIdentifier` en una tarjeta se hereda a su único botón salvo que la tarjeta sea
  `accessibilityElement(children: .contain)`. `UserDefaults` no es `Sendable` en el SDK 27
  (`@unchecked`). El target de UI tests necesita `SWIFT_DEFAULT_ACTOR_ISOLATION = nonisolated`.
  `xcode-select` debe apuntar a Xcode (`sudo xcode-select -s /Applications/Xcode.app`) o exportar
  `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`. Con XcodeGen + Xcode 27 locales, los
  targets de pruebas necesitan `GENERATE_INFOPLIST_FILE: YES` (el CI pasaba sin él).
  `TARGETED_DEVICE_FAMILY: "1"` (solo iPhone) va en el target de la app: XcodeGen pone "1,2" a
  nivel de target y tapa el valor del proyecto.
- CI: `.github/workflows/ios.yml` (runner macOS, XcodeGen + swift test + xcodebuild test).

## Publicación (App Store Connect)

- App "El Impostor: Palabras", id `6814065408`, SKU `elimpostor-ios`, idioma principal es-MX.
- `ios/scripts/asc.py`: cliente mínimo de la API (llave en `~/.appstoreconnect/private_keys/`,
  IDs en `ios/.asc.env`, no versionado). `ios/scripts/publicar.sh` archiva y sube; el número de
  build lo asigna Xcode al exportar (`manageAppVersionAndBuildNumber` en `ExportOptions.plist`), no
  hace falta tocar `CURRENT_PROJECT_VERSION`. La versión sí se sube a mano en `MARKETING_VERSION`
  (el `Info.plist` la toma de ahí); cada versión nueva de la tienda necesita su número.
- TestFlight: grupo interno "Equipo" (Daniel) y externo "Familia y amigos" con link público
  https://testflight.apple.com/join/ZnsnKG1C (límite 200). Solo un build por versión puede estar
  en revisión beta a la vez; los siguientes de la misma versión se aprueban casi al instante.
- Ficha 1.0 lista: subtítulo "Juego de fiesta para familias", descripción, palabras clave,
  categoría Juegos › Palabras + Familia, gratis, 19 países hispanohablantes + EE. UU., edad 4+,
  privacidad "No se recopilan datos", copyright "2026 Daniel Peimbert", URL de marketing = perfil
  de X. **Nunca "Gratis" en nombre, subtítulo ni capturas** (regla 2.3.7).
- Ficha por idioma en `ios/tienda/<ficha>/` (`es-MX`, `en-US`): `ficha.json` (nombre, subtítulo,
  textos, palabras clave, novedades y los `locales` de App Store Connect a los que se copia; la
  inglesa va a en-US, en-GB, en-AU y en-CA porque cada tienda solo muestra sus idiomas) y las 6
  capturas. `ios/scripts/ficha.py <versión> [--crear] [--simular]` valida y sube todo.
- Capturas 6.9" (1320×2868): `ios/scripts/capturas.sh "iPhone 18 Pro Max"
  ios/DerivedData/capturas-tienda/<ficha> <es-MX|en>` y luego `ios/scripts/capturas_tienda.py <ficha>`
  (títulos por idioma en el script) → `ios/tienda/<ficha>/`.
- Nombre en inglés: "The Impostor: Pass the Phone" (decidido el 23-sep-2026; "Word Game" se descartó
  por parecerse a "Imposter Who? - Word Game"), subtítulo "Party game for families".
- **1.0 publicada** el 25-sep-2026 en México y EE. UU. (https://apps.apple.com/app/id6814065408).
- **1.1 (build 3) enviada a revisión** el 25-sep-2026, publicación manual: fichas es-MX y en-US/GB/AU/CA
  subidas con `ios/scripts/ficha.py 1.1 --crear`, notas para el revisor en inglés. También aprobada
  en TestFlight para "Familia y amigos". Pendiente al aprobarse: que Daniel la libere y entonces
  abrir los 17 países hispanohablantes restantes + GB, CA, AU, NZ, IE (no antes, para que nadie
  reciba la 1.0 con el banco mexicano).

## Comandos web

```bash
pnpm install && pnpm dev     # http://127.0.0.1:4517
pnpm test && pnpm lint && pnpm build
pnpm words:export            # regenera data/words.es-MX.json y data/words.en.json
```

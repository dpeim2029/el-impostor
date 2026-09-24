#!/usr/bin/env bash
# Captura cada pantalla de la app en el simulador sembrando el estado guardado (mismo JSON que la web).
# Uso: ios/scripts/capturas.sh [dispositivo] [carpeta-de-salida] [idioma: es-MX | en]
set -euo pipefail

DISPOSITIVO="${1:-iPhone 17e}"
SALIDA="${2:-ios/DerivedData/capturas}"
IDIOMA="${3:-es-MX}"
APP="ios/DerivedData/Build/Products/Debug-iphonesimulator/ElImpostor.app"
BUNDLE="mx.elimpostor.app"
CLAVE="el-impostor:v1"
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"

cd "$(dirname "$0")/../.."
mkdir -p "$SALIDA"

xcrun simctl boot "$DISPOSITIVO" 2>/dev/null || true
xcrun simctl bootstatus "$DISPOSITIVO" -b >/dev/null
xcrun simctl install "$DISPOSITIVO" "$APP"
# Barra de estado limpia, como en las capturas de la App Store.
xcrun simctl status_bar "$DISPOSITIVO" override --time 9:41 --batteryState discharging --batteryLevel 100 \
  --cellularMode active --cellularBars 4 --wifiBars 3 --dataNetwork wifi
# UserDefaults vive en el contenedor de la app; `defaults write <bundle>` iría al dominio global del simulador.
CONTENEDOR="$(xcrun simctl get_app_container "$DISPOSITIVO" "$BUNDLE" data)"
DOMINIO="$CONTENEDOR/Library/Preferences/$BUNDLE"

if [[ "$IDIOMA" == en* ]]; then
  JUGADORES='[{"id":"j1","nombre":"Emma"},{"id":"j2","nombre":"Jack"},{"id":"j3","nombre":"Lily"},{"id":"j4","nombre":"Noah"},{"id":"j5","nombre":"Grandma Rose"},{"id":"j6","nombre":"Uncle Mike"}]'
  PALABRA='{"texto":"Pizza","pista":"Italy","categoriaId":"comida","categoriaNombre":"Food","categoriaEmoji":"🍔"}'
else
  JUGADORES='[{"id":"j1","nombre":"Ana"},{"id":"j2","nombre":"Luis"},{"id":"j3","nombre":"Sofi"},{"id":"j4","nombre":"Beto"},{"id":"j5","nombre":"Abuela Rosa"},{"id":"j6","nombre":"Tío Memo"}]'
  PALABRA='{"texto":"Pizza","pista":"Italia","categoriaId":"comida","categoriaNombre":"Comida","categoriaEmoji":"🌮"}'
fi
# Las categorías por defecto de cada región (-AppleLocale): México con es_MX; ninguna regional con "en".
REGIONAL=$([[ "$IDIOMA" == "es-MX" ]] && echo ',"mexico"' || true)
AJUSTES='{"numImpostores":1,"conPista":true,"categoriasActivas":["animales","comida","frutas-verduras","casa","escuela","profesiones","deportes","transporte","lugares","naturaleza","fiestas","musica"'"$REGIONAL"']}'
ROLES='{"j1":"civil","j2":"impostor","j3":"civil","j4":"civil","j5":"civil","j6":"civil"}'

# estado <fase> <indiceReparto> <acusaciones-json>
estado() {
  local fase="$1" indice="$2" acusaciones="$3"
  if [[ "$fase" == "inicio" ]]; then
    echo "{\"fase\":\"inicio\",\"jugadores\":$JUGADORES,\"ajustes\":$AJUSTES,\"ronda\":null,\"indiceReparto\":0,\"palabrasUsadas\":[]}"
  else
    echo "{\"fase\":\"$fase\",\"jugadores\":$JUGADORES,\"ajustes\":$AJUSTES,\"ronda\":{\"palabra\":$PALABRA,\"roles\":$ROLES,\"orden\":[\"j3\",\"j4\",\"j5\",\"j6\",\"j1\",\"j2\"],\"acusaciones\":$acusaciones,\"vuelta\":1},\"indiceReparto\":$indice,\"palabrasUsadas\":[\"comida:Pizza\"]}"
  fi
}

# capturar <nombre> <json-o-vacío> <args de lanzamiento...>
capturar() {
  local nombre="$1" json="$2"; shift 2
  xcrun simctl terminate "$DISPOSITIVO" "$BUNDLE" 2>/dev/null || true
  if [[ -n "$json" ]]; then
    xcrun simctl spawn "$DISPOSITIVO" defaults write "$DOMINIO" "$CLAVE" -string "$json"
  else
    xcrun simctl spawn "$DISPOSITIVO" defaults delete "$DOMINIO" "$CLAVE" 2>/dev/null || true
  fi
  xcrun simctl launch "$DISPOSITIVO" "$BUNDLE" "$@" -AppleLanguages "($IDIOMA)" -AppleLocale "${IDIOMA/-/_}" >/dev/null
  sleep 2.5
  xcrun simctl io "$DISPOSITIVO" screenshot "$SALIDA/$nombre.png" >/dev/null
  echo "✓ $nombre"
}

capturar 01-inicio "" --reiniciar
capturar 02-como-jugar "" --reiniciar --fase como-jugar
capturar 03-ajustes "$(estado inicio 0 '[]')" --fase ajustes
capturar 04-reparto-oculta "$(estado reparto 0 '[]')"
capturar 05-reparto-civil "$(estado reparto 0 '[]')" --mostrar-carta
capturar 06-reparto-impostor "$(estado reparto 1 '[]')" --mostrar-carta
capturar 07-ronda "$(estado ronda 0 '[]')"
capturar 08-votacion "$(estado votacion 0 '[]')"
capturar 09-resultado-ganan "$(estado resultado 0 '["j2"]')"
capturar 10-resultado-pierden "$(estado resultado 0 '["j1"]')"

xcrun simctl terminate "$DISPOSITIVO" "$BUNDLE" 2>/dev/null || true
echo "Capturas en $SALIDA"

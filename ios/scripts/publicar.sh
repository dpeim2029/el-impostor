#!/usr/bin/env bash
# Archiva la app firmada para distribución y la sube a App Store Connect (TestFlight).
#
# Uso: ios/scripts/publicar.sh [--solo-archivar]
#
# Requiere:
#   - Cuenta de Apple Developer de pago iniciada en Xcode (firma automática).
#   - Para subir: llave de App Store Connect en ~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8
#     y las variables ASC_KEY_ID y ASC_ISSUER_ID (o un archivo ios/.asc.env con ellas, no versionado).
set -euo pipefail
cd "$(dirname "$0")/../.."
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"

ARCHIVO="ios/DerivedData/ElImpostor.xcarchive"
SALIDA="ios/DerivedData/Export"

[ -f ios/.asc.env ] && source ios/.asc.env

echo "▸ Generando proyecto"
xcodegen generate --spec ios/project.yml --project ios --quiet

echo "▸ Archivando (Release, firma automática)"
rm -rf "$ARCHIVO"
xcodebuild archive \
  -project ios/ElImpostor.xcodeproj \
  -scheme ElImpostor \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVO" \
  -allowProvisioningUpdates \
  -quiet

if [[ "${1:-}" == "--solo-archivar" ]]; then
  echo "✓ Archivo listo en $ARCHIVO"
  exit 0
fi

: "${ASC_KEY_ID:?Falta ASC_KEY_ID (Key ID de la llave de App Store Connect)}"
: "${ASC_ISSUER_ID:?Falta ASC_ISSUER_ID (Issuer ID de App Store Connect)}"
LLAVE="$HOME/.appstoreconnect/private_keys/AuthKey_${ASC_KEY_ID}.p8"
[ -f "$LLAVE" ] || { echo "No existe $LLAVE"; exit 1; }

echo "▸ Exportando y subiendo a App Store Connect"
rm -rf "$SALIDA"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVO" \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath "$SALIDA" \
  -allowProvisioningUpdates \
  -authenticationKeyPath "$LLAVE" \
  -authenticationKeyID "$ASC_KEY_ID" \
  -authenticationKeyIssuerID "$ASC_ISSUER_ID" \
  -quiet

echo "✓ Build subido. Aparecerá en TestFlight en unos minutos (procesamiento de Apple)."

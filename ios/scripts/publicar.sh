#!/usr/bin/env bash
# Archiva la app firmada para distribución y la sube a App Store Connect (TestFlight).
#
# Uso: ios/scripts/publicar.sh [--solo-archivar] [--con-llave]
#
# Requiere una cuenta de Apple Developer de pago iniciada en Xcode (firma automática). Por defecto
# exporta y sube con esa sesión de Xcode. Con --con-llave usa la llave de App Store Connect
# (~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8 + ASC_KEY_ID/ASC_ISSUER_ID en ios/.asc.env);
# ojo: la llave necesita "Acceso a certificados de distribución en la nube", si no, la exportación falla.
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

if [[ " $* " == *" --solo-archivar "* ]]; then
  echo "✓ Archivo listo en $ARCHIVO"
  exit 0
fi

AUTENTICACION=()
if [[ " $* " == *" --con-llave "* ]]; then
  : "${ASC_KEY_ID:?Falta ASC_KEY_ID (Key ID de la llave de App Store Connect)}"
  : "${ASC_ISSUER_ID:?Falta ASC_ISSUER_ID (Issuer ID de App Store Connect)}"
  LLAVE="$HOME/.appstoreconnect/private_keys/AuthKey_${ASC_KEY_ID}.p8"
  [ -f "$LLAVE" ] || { echo "No existe $LLAVE"; exit 1; }
  AUTENTICACION=(-authenticationKeyPath "$LLAVE" -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID")
  echo "▸ Exportando y subiendo a App Store Connect (llave API)"
else
  echo "▸ Exportando y subiendo a App Store Connect (cuenta iniciada en Xcode)"
fi
rm -rf "$SALIDA"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVO" \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath "$SALIDA" \
  -allowProvisioningUpdates \
  ${AUTENTICACION[@]+"${AUTENTICACION[@]}"} \
  2>&1 | { grep -v -E 'Progress [0-9]+%|^$' || true; }

echo "✓ Build subido. Aparecerá en TestFlight en unos minutos (procesamiento de Apple)."

#!/usr/bin/env python3
"""Sube la ficha de la App Store (textos y capturas) desde ios/tienda/<ficha>/ a App Store Connect.

Uso: ios/scripts/ficha.py <versión> [--crear] [--simular] [ficha ...]
     ios/scripts/ficha.py 1.1 --simular          # valida longitudes y muestra qué haría
     ios/scripts/ficha.py 1.1 --crear            # crea la versión 1.1 si no existe y sube todo

Cada ios/tienda/<ficha>/ficha.json trae los textos y la lista de `locales` de App Store Connect a
los que se copian (en-US, en-GB, en-AU, en-CA comparten la ficha en inglés); las capturas son los
PNG de esa misma carpeta, en orden de nombre. Sin fichas en la línea de comandos, sube todas.
"""
import hashlib, json, pathlib, sys, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from asc import llamar  # noqa: E402

RAIZ = pathlib.Path(__file__).resolve().parents[2]
TIENDA = RAIZ / "ios/tienda"
APP = "6814065408"
PANTALLA = "APP_IPHONE_67"  # 6.9"; cubre también los iPhone más chicos.
LIMITES = {"nombre": 30, "subtitulo": 30, "palabrasClave": 100, "promocional": 170,
           "descripcion": 4000, "novedades": 4000}


def validar(nombre: str, ficha: dict) -> list[str]:
    errores = [f"{nombre}: {campo} tiene {len(ficha[campo])} caracteres (máximo {maximo})"
               for campo, maximo in LIMITES.items() if len(ficha.get(campo) or "") > maximo]
    if "gratis" in (ficha["nombre"] + ficha["subtitulo"]).lower() or "free" in (ficha["nombre"] + ficha["subtitulo"]).lower():
        errores.append(f"{nombre}: el precio no va en nombre ni subtítulo (regla 2.3.7)")
    return errores


def comprobar(estado: int, respuesta: dict, que: str):
    if estado >= 300:
        raise SystemExit(f"{que}: {estado} {json.dumps(respuesta.get('errors'), ensure_ascii=False)[:800]}")


def version(texto: str, crear: bool) -> str | None:
    _, r = llamar("GET", f"/v1/apps/{APP}/appStoreVersions?filter[versionString]={texto}&filter[platform]=IOS")
    if r["data"]:
        return r["data"][0]["id"]
    if not crear:
        return None
    estado, r = llamar("POST", "/v1/appStoreVersions", {"data": {
        "type": "appStoreVersions", "attributes": {"platform": "IOS", "versionString": texto, "releaseType": "MANUAL"},
        "relationships": {"app": {"data": {"type": "apps", "id": APP}}}}})
    comprobar(estado, r, f"crear la versión {texto}")
    return r["data"]["id"]


def info_editable() -> str:
    _, r = llamar("GET", f"/v1/apps/{APP}/appInfos")
    for info in r["data"]:
        if info["attributes"].get("state") in ("PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED"):
            return info["id"]
    raise SystemExit("No hay información de la app editable (¿la versión sigue en revisión?)")


def upsert(ruta_lista: str, tipo: str, locale: str, atributos: dict, relacion: tuple[str, str, str]):
    """Crea o actualiza la localización `locale` de un recurso (appInfo o appStoreVersion)."""
    _, r = llamar("GET", ruta_lista)
    existente = next((d for d in r["data"] if d["attributes"]["locale"] == locale), None)
    if existente:
        estado, r = llamar("PATCH", f"/v1/{tipo}/{existente['id']}",
                           {"data": {"type": tipo, "id": existente["id"], "attributes": atributos}})
        comprobar(estado, r, f"{tipo} {locale}")
        return existente["id"]
    nombre_rel, tipo_rel, id_rel = relacion
    estado, r = llamar("POST", f"/v1/{tipo}", {"data": {
        "type": tipo, "attributes": {"locale": locale, **atributos},
        "relationships": {nombre_rel: {"data": {"type": tipo_rel, "id": id_rel}}}}})
    comprobar(estado, r, f"{tipo} {locale}")
    return r["data"]["id"]


def subir_capturas(localizacion: str, pngs: list[pathlib.Path]):
    _, r = llamar("GET", f"/v1/appStoreVersionLocalizations/{localizacion}/appScreenshotSets?include=appScreenshots")
    juego = next((d for d in r["data"] if d["attributes"]["screenshotDisplayType"] == PANTALLA), None)
    if juego:
        for anterior in (juego["relationships"]["appScreenshots"].get("data") or []):
            llamar("DELETE", f"/v1/appScreenshots/{anterior['id']}")
        id_juego = juego["id"]
    else:
        estado, r = llamar("POST", "/v1/appScreenshotSets", {"data": {
            "type": "appScreenshotSets", "attributes": {"screenshotDisplayType": PANTALLA},
            "relationships": {"appStoreVersionLocalization": {"data": {"type": "appStoreVersionLocalizations", "id": localizacion}}}}})
        comprobar(estado, r, "crear juego de capturas")
        id_juego = r["data"]["id"]
    ids = []
    for png in pngs:
        datos = png.read_bytes()
        estado, r = llamar("POST", "/v1/appScreenshots", {"data": {
            "type": "appScreenshots", "attributes": {"fileName": png.name, "fileSize": len(datos)},
            "relationships": {"appScreenshotSet": {"data": {"type": "appScreenshotSets", "id": id_juego}}}}})
        comprobar(estado, r, f"reservar {png.name}")
        captura = r["data"]["id"]
        for op in r["data"]["attributes"]["uploadOperations"]:
            pedazo = datos[op["offset"]:op["offset"] + op["length"]]
            encabezados = {h["name"]: h["value"] for h in op["requestHeaders"]}
            urllib.request.urlopen(urllib.request.Request(op["url"], data=pedazo, method=op["method"], headers=encabezados)).read()
        estado, r = llamar("PATCH", f"/v1/appScreenshots/{captura}", {"data": {
            "type": "appScreenshots", "id": captura,
            "attributes": {"uploaded": True, "sourceFileChecksum": hashlib.md5(datos).hexdigest()}}})
        comprobar(estado, r, f"confirmar {png.name}")
        ids.append(captura)
    estado, r = llamar("PATCH", f"/v1/appScreenshotSets/{id_juego}/relationships/appScreenshots",
                       {"data": [{"type": "appScreenshots", "id": i} for i in ids]})
    comprobar(estado, r, "ordenar capturas")


def main():
    argumentos = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not argumentos:
        raise SystemExit(__doc__)
    texto_version, fichas = argumentos[0], argumentos[1:]
    simular, crear = "--simular" in sys.argv, "--crear" in sys.argv
    carpetas = [TIENDA / f for f in fichas] if fichas else sorted(p.parent for p in TIENDA.glob("*/ficha.json"))

    errores = []
    cargadas = []
    for carpeta in carpetas:
        ficha = json.loads((carpeta / "ficha.json").read_text())
        pngs = sorted(carpeta.glob("*.png"))
        errores += validar(carpeta.name, ficha)
        if not 1 <= len(pngs) <= 10:
            errores.append(f"{carpeta.name}: {len(pngs)} capturas (de 1 a 10)")
        cargadas.append((carpeta.name, ficha, pngs))
    if errores:
        raise SystemExit("\n".join(errores))

    id_version = version(texto_version, crear and not simular)
    for nombre, ficha, pngs in cargadas:
        print(f"{nombre} → {', '.join(ficha['locales'])}: {ficha['nombre']} · {len(pngs)} capturas")
    if simular:
        print(f"(simulación) versión {texto_version}: {'existe' if id_version else 'no existe; usa --crear'}")
        return
    if not id_version:
        raise SystemExit(f"La versión {texto_version} no existe; usa --crear")
    info = info_editable()

    for nombre, ficha, pngs in cargadas:
        for locale in ficha["locales"]:
            upsert(f"/v1/appInfos/{info}/appInfoLocalizations", "appInfoLocalizations", locale,
                   {"name": ficha["nombre"], "subtitle": ficha["subtitulo"], "privacyPolicyUrl": ficha["privacidad"]},
                   ("appInfo", "appInfos", info))
            atributos = {"description": ficha["descripcion"], "keywords": ficha["palabrasClave"],
                         "promotionalText": ficha["promocional"], "supportUrl": ficha["soporte"],
                         "marketingUrl": ficha["marketing"]}
            if ficha.get("novedades"):
                atributos["whatsNew"] = ficha["novedades"]
            localizacion = upsert(f"/v1/appStoreVersions/{id_version}/appStoreVersionLocalizations",
                                  "appStoreVersionLocalizations", locale, atributos,
                                  ("appStoreVersion", "appStoreVersions", id_version))
            subir_capturas(localizacion, pngs)
            print(f"✓ {locale}")


if __name__ == "__main__":
    main()

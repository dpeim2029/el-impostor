#!/usr/bin/env python3
"""Arma las capturas de la App Store: título + pantalla real en un iPhone sobre fondo de color.

Uso: ios/scripts/capturas.sh "iPhone 18 Pro Max" ios/DerivedData/capturas-tienda/<ficha> <idioma de la app>
     ios/scripts/capturas_tienda.py [ficha]

<ficha> es el idioma de App Store Connect (es-MX, en-US); el idioma de la app es es-MX o en.
Toma las capturas crudas de ios/DerivedData/capturas-tienda/<ficha>, las compone con Chrome sin
ventana y deja PNG de 1320×2868 (6.9") sin transparencia en ios/tienda/<ficha>/.
"""
import html, pathlib, subprocess, sys, tempfile
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parents[2]
CRUDAS = RAIZ / "ios/DerivedData/capturas-tienda"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ANCHO, ALTO = 1320, 2868

# Colores de Assets.xcassets/Colores.
AMARILLO, LILA, CIELO, DURAZNO, MENTA, BLANCO = "#F7C948", "#CBBBFF", "#9AD5FF", "#FFB38A", "#BFF3E4", "#FFFFFF"

# (archivo, captura cruda, fondo, color del marcador, renglones del título; *renglón* lleva marcador)
CAPTURAS = {
    "es-MX": [
        ("1-palabra", "05-reparto-civil", LILA, AMARILLO, ["Todos saben", "la palabra.", "*Menos uno.*"]),
        ("2-impostor", "06-reparto-impostor", CIELO, AMARILLO, ["¿Y si el impostor", "*eres tú?*"]),
        ("3-sin-anuncios", "01-inicio", AMARILLO, BLANCO, ["Sin anuncios.", "Sin suscripción.", "*Nunca.*"]),
        ("4-ronda", "07-ronda", MENTA, AMARILLO, ["*Finge bien.*", "Alguien te está", "escuchando."]),
        ("5-votacion", "09-resultado-ganan", DURAZNO, BLANCO, ["Voten.", "*¿Lo atraparon?*"]),
        ("6-familia", "03-ajustes", LILA, AMARILLO, ["Toda la familia,", "*un solo teléfono*"]),
    ],
    "en-US": [
        ("1-palabra", "05-reparto-civil", LILA, AMARILLO, ["Everyone knows", "the word.", "*Except one.*"]),
        ("2-impostor", "06-reparto-impostor", CIELO, AMARILLO, ["What if the", "impostor", "*is you?*"]),
        ("3-sin-anuncios", "01-inicio", AMARILLO, BLANCO, ["No ads.", "No subscription.", "*Ever.*"]),
        ("4-ronda", "07-ronda", MENTA, AMARILLO, ["*Fake it well.*", "Someone's", "listening."]),
        ("5-votacion", "09-resultado-ganan", DURAZNO, BLANCO, ["Vote.", "*Caught them?*"]),
        ("6-familia", "03-ajustes", LILA, AMARILLO, ["The whole family,", "*one phone*"]),
    ],
}

PLANTILLA = """<!doctype html><html><head><meta charset="utf-8"><style>
html, body {{ margin: 0; width: {ancho}px; height: {alto}px; overflow: hidden; }}
body {{ background: {fondo}; font-family: -apple-system, system-ui, sans-serif; color: #111; position: relative; }}
h1 {{ margin: 0; position: absolute; top: 180px; left: 70px; right: 70px; text-align: center;
     font-size: 118px; font-weight: 900; line-height: 1.1; letter-spacing: -2px; text-transform: uppercase; }}
h1 span {{ display: inline-block; white-space: nowrap; }}
.marca {{ background: {marca}; padding: 0 24px; border-radius: 22px; transform: rotate(-2deg); margin: 10px 0; }}
.telefono {{ position: absolute; left: 50%; top: 740px; width: 1000px; transform: translateX(-50%);
            padding: 22px; background: #111; border-radius: 150px;
            box-shadow: 0 50px 120px rgba(0,0,0,.28), 0 0 0 4px rgba(0,0,0,.15); }}
.telefono img {{ display: block; width: 100%; border-radius: 128px; }}
.isla {{ position: absolute; top: 48px; left: 50%; transform: translateX(-50%);
        width: 290px; height: 84px; background: #111; border-radius: 42px; }}
</style></head><body>
<h1>{titulo}</h1>
<div class="telefono"><img src="{imagen}"><div class="isla"></div></div>
<script>
  // Encoge el título hasta que cada renglón quepa y lo centra en el espacio sobre el teléfono,
  // que queda a la misma altura en todas las capturas.
  const h1 = document.querySelector("h1"), tel = document.querySelector(".telefono");
  let tam = 118;
  while ([...h1.querySelectorAll("span")].some(s => s.offsetWidth > h1.clientWidth - 30) && tam > 70) {{
    h1.style.fontSize = (tam -= 2) + "px";
  }}
  h1.style.top = Math.max(120, (tel.offsetTop - h1.offsetHeight) / 2) + "px";
</script>
</body></html>"""


def componer(idioma: str):
    salida = RAIZ / "ios/tienda" / idioma
    salida.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for nombre, cruda, fondo, marca, renglones in CAPTURAS[idioma]:
            titulo = "<br>".join(
                f'<span class="marca">{html.escape(r[1:-1])}</span>' if r.startswith("*") else f"<span>{html.escape(r)}</span>"
                for r in renglones)
            pagina = pathlib.Path(tmp) / f"{nombre}.html"
            pagina.write_text(PLANTILLA.format(
                ancho=ANCHO, alto=ALTO, fondo=fondo, marca=marca, titulo=titulo, imagen=(CRUDAS / idioma / f"{cruda}.png").as_uri()))
            png = pathlib.Path(tmp) / f"{nombre}.png"
            subprocess.run([CHROME, "--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1",
                            f"--window-size={ANCHO},{ALTO}", f"--screenshot={png}", "--allow-file-access-from-files",
                            pagina.as_uri()], check=True, capture_output=True)
            # La App Store rechaza capturas con canal alfa.
            Image.open(png).convert("RGB").save(salida / f"{nombre}.png", optimize=True)
            print(f"✓ {idioma}/{nombre}.png")


if __name__ == "__main__":
    componer(sys.argv[1] if len(sys.argv) > 1 else "es-MX")

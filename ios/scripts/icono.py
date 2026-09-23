#!/usr/bin/env python3
"""Genera los íconos planos (App Store y web) a partir de la capa de cartas del ícono de iOS.

Uso: ios/scripts/icono.py

Fuente: ios/ElImpostor/Resources/AppIcon.icon/Assets/cartas.png (cartas con sombra, fondo transparente)
sobre el azul noche de icon.json. Escribe el PNG 1024 de respaldo de iOS y los íconos de public/.
"""
import pathlib
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parents[2]
CARTAS = RAIZ / "ios/ElImpostor/Resources/AppIcon.icon/Assets/cartas.png"
FONDO = "#1B2440"  # Igual al "fill" de AppIcon.icon/icon.json.


def plano(tamano: int, escala: float = 1.0) -> Image.Image:
    """Fondo liso con las cartas centradas; `escala` < 1 deja margen (zona segura de íconos maskable)."""
    cartas = Image.open(CARTAS)
    lado = round(1024 * escala)
    base = Image.new("RGBA", (1024, 1024), FONDO)
    base.alpha_composite(cartas.resize((lado, lado), Image.LANCZOS), ((1024 - lado) // 2, (1024 - lado) // 2))
    # Sin canal alfa: App Store y iOS lo rechazan o lo pintan de negro.
    return base.convert("RGB").resize((tamano, tamano), Image.LANCZOS)


def main():
    salidas = {
        "ios/ElImpostor/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png": plano(1024),
        "public/apple-touch-icon.png": plano(180),
        "public/pwa-192.png": plano(192),
        "public/pwa-512.png": plano(512),
        # Android recorta los maskable a un círculo del 80 %: las cartas van más chicas.
        "public/pwa-maskable-512.png": plano(512, escala=0.78),
        "public/favicon.png": plano(96),
    }
    for ruta, imagen in salidas.items():
        imagen.save(RAIZ / ruta, optimize=True)
        print(f"✓ {ruta}")


if __name__ == "__main__":
    main()

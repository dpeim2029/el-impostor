#!/usr/bin/env python3
"""Cliente mínimo de la App Store Connect API (sin dependencias: firma ES256 con openssl).

Uso: ios/scripts/asc.py GET /v1/apps
     ios/scripts/asc.py POST /v1/bundleIds '{"data": {...}}'
Lee ASC_KEY_ID y ASC_ISSUER_ID del entorno o de ios/.asc.env; la llave va en
~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8.
"""
import base64, json, os, pathlib, subprocess, sys, tempfile, time, urllib.error, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parents[2]


def cargar_env():
    env = RAIZ / "ios" / ".asc.env"
    if env.exists():
        for linea in env.read_text().splitlines():
            linea = linea.strip().removeprefix("export ").strip()
            if "=" in linea and not linea.startswith("#"):
                k, v = linea.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def b64url(datos: bytes) -> str:
    return base64.urlsafe_b64encode(datos).rstrip(b"=").decode()


def der_a_raw(der: bytes) -> bytes:
    """Convierte una firma ECDSA DER (SEQUENCE de dos INTEGER) a r||s de 64 bytes."""
    assert der[0] == 0x30
    i = 2
    assert der[i] == 0x02
    lr = der[i + 1]; r = der[i + 2:i + 2 + lr]; i = i + 2 + lr
    assert der[i] == 0x02
    ls = der[i + 1]; s = der[i + 2:i + 2 + ls]
    r = r.lstrip(b"\x00").rjust(32, b"\x00"); s = s.lstrip(b"\x00").rjust(32, b"\x00")
    return r + s


def token() -> str:
    cargar_env()
    kid = os.environ["ASC_KEY_ID"]; iss = os.environ["ASC_ISSUER_ID"]
    llave = pathlib.Path.home() / ".appstoreconnect" / "private_keys" / f"AuthKey_{kid}.p8"
    ahora = int(time.time())
    cab = b64url(json.dumps({"alg": "ES256", "kid": kid, "typ": "JWT"}).encode())
    cuerpo = b64url(json.dumps({"iss": iss, "iat": ahora, "exp": ahora + 1200, "aud": "appstoreconnect-v1"}).encode())
    mensaje = f"{cab}.{cuerpo}".encode()
    with tempfile.NamedTemporaryFile() as tmp:
        tmp.write(mensaje); tmp.flush()
        der = subprocess.run(["openssl", "dgst", "-sha256", "-sign", str(llave), tmp.name], capture_output=True, check=True).stdout
    return f"{cab}.{cuerpo}.{b64url(der_a_raw(der))}"


def llamar(metodo: str, ruta: str, cuerpo=None):
    url = ruta if ruta.startswith("http") else f"https://api.appstoreconnect.apple.com{ruta}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, method=metodo, headers={
        "Authorization": f"Bearer {token()}", "Content-Type": "application/json", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            texto = resp.read().decode()
            return resp.status, (json.loads(texto) if texto else {})
    except urllib.error.HTTPError as e:
        texto = e.read().decode()
        try:
            return e.code, json.loads(texto)
        except json.JSONDecodeError:
            return e.code, {"raw": texto}


if __name__ == "__main__":
    metodo, ruta = sys.argv[1], sys.argv[2]
    cuerpo = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
    estado, respuesta = llamar(metodo, ruta, cuerpo)
    print(estado)
    print(json.dumps(respuesta, indent=2, ensure_ascii=False))

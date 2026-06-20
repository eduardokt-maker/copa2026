from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


APP_NAME = "copa2026"
APP_VERSION = "2026.06.20-render-ready-v1"
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


TEAMS = [
    {"name": "Algeria", "country": "Argelia", "code": "dz", "confederation": "CAF", "region": "Africa"},
    {"name": "Argentina", "country": "Argentina", "code": "ar", "confederation": "CONMEBOL", "region": "America do Sul", "champion": True},
    {"name": "Australia", "country": "Australia", "code": "au", "confederation": "AFC", "region": "Asia/Oceania"},
    {"name": "Austria", "country": "Austria", "code": "at", "confederation": "UEFA", "region": "Europa"},
    {"name": "Belgium", "country": "Belgica", "code": "be", "confederation": "UEFA", "region": "Europa"},
    {"name": "Bosnia and Herzegovina", "country": "Bosnia e Herzegovina", "code": "ba", "confederation": "UEFA", "region": "Europa"},
    {"name": "Brazil", "country": "Brasil", "code": "br", "confederation": "CONMEBOL", "region": "America do Sul"},
    {"name": "Canada", "country": "Canada", "code": "ca", "confederation": "CONCACAF", "region": "America do Norte", "host": True},
    {"name": "Cape Verde", "country": "Cabo Verde", "code": "cv", "confederation": "CAF", "region": "Africa", "debut": True},
    {"name": "Colombia", "country": "Colombia", "code": "co", "confederation": "CONMEBOL", "region": "America do Sul"},
    {"name": "Croatia", "country": "Croacia", "code": "hr", "confederation": "UEFA", "region": "Europa"},
    {"name": "Curacao", "country": "Curacao", "code": "cw", "confederation": "CONCACAF", "region": "Caribe", "debut": True},
    {"name": "Czech Republic", "country": "Republica Tcheca", "code": "cz", "confederation": "UEFA", "region": "Europa"},
    {"name": "DR Congo", "country": "RD Congo", "code": "cd", "confederation": "CAF", "region": "Africa"},
    {"name": "Ecuador", "country": "Equador", "code": "ec", "confederation": "CONMEBOL", "region": "America do Sul"},
    {"name": "Egypt", "country": "Egito", "code": "eg", "confederation": "CAF", "region": "Africa"},
    {"name": "England", "country": "Inglaterra", "code": "gb-eng", "confederation": "UEFA", "region": "Europa"},
    {"name": "France", "country": "Franca", "code": "fr", "confederation": "UEFA", "region": "Europa"},
    {"name": "Germany", "country": "Alemanha", "code": "de", "confederation": "UEFA", "region": "Europa"},
    {"name": "Ghana", "country": "Gana", "code": "gh", "confederation": "CAF", "region": "Africa"},
    {"name": "Haiti", "country": "Haiti", "code": "ht", "confederation": "CONCACAF", "region": "Caribe"},
    {"name": "Iran", "country": "Ira", "code": "ir", "confederation": "AFC", "region": "Asia"},
    {"name": "Iraq", "country": "Iraque", "code": "iq", "confederation": "AFC", "region": "Asia"},
    {"name": "Ivory Coast", "country": "Costa do Marfim", "code": "ci", "confederation": "CAF", "region": "Africa"},
    {"name": "Japan", "country": "Japao", "code": "jp", "confederation": "AFC", "region": "Asia"},
    {"name": "Jordan", "country": "Jordania", "code": "jo", "confederation": "AFC", "region": "Asia", "debut": True},
    {"name": "Mexico", "country": "Mexico", "code": "mx", "confederation": "CONCACAF", "region": "America do Norte", "host": True},
    {"name": "Morocco", "country": "Marrocos", "code": "ma", "confederation": "CAF", "region": "Africa"},
    {"name": "Netherlands", "country": "Paises Baixos", "code": "nl", "confederation": "UEFA", "region": "Europa"},
    {"name": "New Zealand", "country": "Nova Zelandia", "code": "nz", "confederation": "OFC", "region": "Oceania"},
    {"name": "Norway", "country": "Noruega", "code": "no", "confederation": "UEFA", "region": "Europa"},
    {"name": "Panama", "country": "Panama", "code": "pa", "confederation": "CONCACAF", "region": "America Central"},
    {"name": "Paraguay", "country": "Paraguai", "code": "py", "confederation": "CONMEBOL", "region": "America do Sul"},
    {"name": "Portugal", "country": "Portugal", "code": "pt", "confederation": "UEFA", "region": "Europa"},
    {"name": "Qatar", "country": "Catar", "code": "qa", "confederation": "AFC", "region": "Asia"},
    {"name": "Saudi Arabia", "country": "Arabia Saudita", "code": "sa", "confederation": "AFC", "region": "Asia"},
    {"name": "Scotland", "country": "Escocia", "code": "gb-sct", "confederation": "UEFA", "region": "Europa"},
    {"name": "Senegal", "country": "Senegal", "code": "sn", "confederation": "CAF", "region": "Africa"},
    {"name": "South Africa", "country": "Africa do Sul", "code": "za", "confederation": "CAF", "region": "Africa"},
    {"name": "South Korea", "country": "Coreia do Sul", "code": "kr", "confederation": "AFC", "region": "Asia"},
    {"name": "Spain", "country": "Espanha", "code": "es", "confederation": "UEFA", "region": "Europa"},
    {"name": "Sweden", "country": "Suecia", "code": "se", "confederation": "UEFA", "region": "Europa"},
    {"name": "Switzerland", "country": "Suica", "code": "ch", "confederation": "UEFA", "region": "Europa"},
    {"name": "Tunisia", "country": "Tunisia", "code": "tn", "confederation": "CAF", "region": "Africa"},
    {"name": "Turkey", "country": "Turquia", "code": "tr", "confederation": "UEFA", "region": "Europa"},
    {"name": "United States", "country": "Estados Unidos", "code": "us", "confederation": "CONCACAF", "region": "America do Norte", "host": True},
    {"name": "Uruguay", "country": "Uruguai", "code": "uy", "confederation": "CONMEBOL", "region": "America do Sul"},
    {"name": "Uzbekistan", "country": "Uzbequistao", "code": "uz", "confederation": "AFC", "region": "Asia", "debut": True},
]


class CopaHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/teams":
            self.send_json({"teams": TEAMS, "count": len(TEAMS), "version": APP_VERSION})
            return
        if path == "/api/status":
            self.send_json({"app": APP_NAME, "version": APP_VERSION, "ok": True})
            return
        if path == "/":
            self.path = "/index.html"
        super().do_GET()

    def send_json(self, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run(host: str | None = None, port: int | None = None) -> None:
    host = host or os.getenv("HOST", "127.0.0.1")
    port_from_env = os.getenv("PORT")
    if port is None:
        port = int(port_from_env) if port_from_env else 8086
    if port_from_env and host == "127.0.0.1":
        host = "0.0.0.0"
    for candidate_port in range(port, port + 10):
        try:
            server = ThreadingHTTPServer((host, candidate_port), CopaHandler)
            port = candidate_port
            break
        except OSError:
            continue
    else:
        raise RuntimeError("Nenhuma porta local disponivel para iniciar o copa2026.")
    print(f"{APP_NAME} {APP_VERSION}")
    print(f"Acesse: http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()

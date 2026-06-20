from __future__ import annotations

import json
import os
import re
import unicodedata
import urllib.request
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


APP_NAME = "copa2026"
APP_VERSION = "2026.06.20-origin-club-label-v1"
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
SQUAD_SOURCE_URL = "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_squads"


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


WORLD_CUP_HISTORY = {
    "dz": {"appearances": 5, "titles": 0},
    "ar": {"appearances": 19, "titles": 3},
    "au": {"appearances": 7, "titles": 0},
    "at": {"appearances": 8, "titles": 0},
    "be": {"appearances": 15, "titles": 0},
    "ba": {"appearances": 2, "titles": 0},
    "br": {"appearances": 23, "titles": 5},
    "ca": {"appearances": 3, "titles": 0},
    "cv": {"appearances": 1, "titles": 0},
    "co": {"appearances": 7, "titles": 0},
    "hr": {"appearances": 7, "titles": 0},
    "cw": {"appearances": 1, "titles": 0},
    "cz": {"appearances": 2, "titles": 0},
    "cd": {"appearances": 2, "titles": 0},
    "ec": {"appearances": 5, "titles": 0},
    "eg": {"appearances": 4, "titles": 0},
    "gb-eng": {"appearances": 17, "titles": 1},
    "fr": {"appearances": 17, "titles": 2},
    "de": {"appearances": 21, "titles": 4},
    "gh": {"appearances": 5, "titles": 0},
    "ht": {"appearances": 2, "titles": 0},
    "ir": {"appearances": 7, "titles": 0},
    "iq": {"appearances": 2, "titles": 0},
    "ci": {"appearances": 4, "titles": 0},
    "jp": {"appearances": 8, "titles": 0},
    "jo": {"appearances": 1, "titles": 0},
    "mx": {"appearances": 18, "titles": 0},
    "ma": {"appearances": 7, "titles": 0},
    "nl": {"appearances": 12, "titles": 0},
    "nz": {"appearances": 3, "titles": 0},
    "no": {"appearances": 4, "titles": 0},
    "pa": {"appearances": 2, "titles": 0},
    "py": {"appearances": 9, "titles": 0},
    "pt": {"appearances": 9, "titles": 0},
    "qa": {"appearances": 2, "titles": 0},
    "sa": {"appearances": 7, "titles": 0},
    "gb-sct": {"appearances": 9, "titles": 0},
    "sn": {"appearances": 4, "titles": 0},
    "za": {"appearances": 4, "titles": 0},
    "kr": {"appearances": 12, "titles": 0},
    "es": {"appearances": 17, "titles": 1},
    "se": {"appearances": 13, "titles": 0},
    "ch": {"appearances": 13, "titles": 0},
    "tn": {"appearances": 7, "titles": 0},
    "tr": {"appearances": 3, "titles": 0},
    "us": {"appearances": 12, "titles": 0},
    "uy": {"appearances": 15, "titles": 2},
    "uz": {"appearances": 1, "titles": 0},
}

for team in TEAMS:
    team.update(WORLD_CUP_HISTORY[team["code"]])


TEAM_BY_CODE = {team["code"]: team for team in TEAMS}
ROSTER_CACHE: dict[str, list[dict[str, str]]] = {}

CLUB_NAME_OVERRIDES = {
    "AC Milan": "Associazione Calcio Milan",
    "AEK Athens": "Athlitiki Enosis Konstantinoupoleos Athens",
    "AIK": "Allmanna Idrottsklubben",
    "APOEL": "Athletikos Podosferikos Omilos Ellinon Lefkosias",
    "AZ Alkmaar": "Alkmaar Zaanstreek",
    "BSC Young Boys": "Berner Sport Club Young Boys",
    "CSKA Moscow": "Central Sports Club of the Army Moscow",
    "DC United": "District of Columbia United",
    "FC Dallas": "Football Club Dallas",
    "FC Porto": "Futebol Clube do Porto",
    "FC Seoul": "Football Club Seoul",
    "FC Utrecht": "Football Club Utrecht",
    "FCSB": "Fotbal Club FCSB",
    "LA Galaxy": "Los Angeles Galaxy",
    "LASK": "Linzer Athletik-Sport-Klub",
    "MLS": "Major League Soccer",
    "NY Red Bulls": "New York Red Bulls",
    "PAOK": "Panthessalonikios Athlitikos Omilos Konstantinoupoliton",
    "PSV Eindhoven": "Philips Sport Vereniging Eindhoven",
    "RB Leipzig": "RasenBallsport Leipzig",
    "Real Madrid": "Real Madrid Club de Futbol",
    "SC Braga": "Sporting Clube de Braga",
    "SL Benfica": "Sport Lisboa e Benfica",
    "Sporting CP": "Sporting Clube de Portugal",
    "TSG Hoffenheim": "Turn- und Sportgemeinschaft Hoffenheim",
}


def normalize_key(value: str) -> str:
    ascii_text = unicodedata.normalize("NFD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", " ", ascii_text.lower()).strip()


def clean_text(value: str) -> str:
    value = re.sub(r"\[[^\]]+\]", "", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def expand_club_name(club: str) -> str:
    return CLUB_NAME_OVERRIDES.get(club, club)


class SquadTableParser(HTMLParser):
    def __init__(self, target_heading: str):
        super().__init__()
        self.target_heading = normalize_key(target_heading)
        self.heading_tag: str | None = None
        self.heading_text: list[str] = []
        self.current_heading_matches = False
        self.in_target_table = False
        self.done = False
        self.row: list[str] | None = None
        self.cell_text: list[str] | None = None
        self.players: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if self.done:
            return
        if tag in {"h2", "h3"}:
            self.heading_tag = tag
            self.heading_text = []
            return
        if self.current_heading_matches and tag == "table":
            self.in_target_table = True
            return
        if self.in_target_table and tag == "tr":
            self.row = []
            return
        if self.row is not None and tag in {"td", "th"}:
            self.cell_text = []

    def handle_data(self, data: str) -> None:
        if self.done:
            return
        if self.heading_tag is not None:
            self.heading_text.append(data)
        if self.cell_text is not None:
            self.cell_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self.done:
            return
        if self.heading_tag == tag:
            heading = clean_text("".join(self.heading_text))
            self.current_heading_matches = normalize_key(heading) == self.target_heading
            self.heading_tag = None
            self.heading_text = []
            return
        if self.cell_text is not None and tag in {"td", "th"}:
            if self.row is not None:
                self.row.append(clean_text("".join(self.cell_text)))
            self.cell_text = None
            return
        if self.row is not None and tag == "tr":
            player = parse_player_row(self.row)
            if player:
                self.players.append(player)
            self.row = None
            return
        if self.in_target_table and tag == "table":
            self.in_target_table = False
            self.done = bool(self.players)


def parse_player_row(cells: list[str]) -> dict[str, str] | None:
    if len(cells) < 7 or cells[0].lower().startswith("no"):
        return None
    position_match = re.search(r"(GK|DF|MF|FW)", cells[1])
    name = re.sub(r"\s*\(captain\)\s*", "", cells[2], flags=re.IGNORECASE)
    club = expand_club_name(cells[-1])
    if not name or not club or not position_match:
        return None
    return {"number": cells[0], "position": position_match.group(1), "name": name, "club": club}


def fetch_roster(team: dict) -> list[dict[str, str]]:
    code = team["code"]
    if code in ROSTER_CACHE:
        return ROSTER_CACHE[code]
    request = urllib.request.Request(
        SQUAD_SOURCE_URL,
        headers={"User-Agent": f"{APP_NAME}/{APP_VERSION} roster reader"},
    )
    with urllib.request.urlopen(request, timeout=12) as response:
        html = response.read().decode("utf-8", errors="replace")
    parser = SquadTableParser(team["name"])
    parser.feed(html)
    ROSTER_CACHE[code] = parser.players
    return parser.players


class CopaHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        if path == "/api/teams":
            self.send_json({"teams": TEAMS, "count": len(TEAMS), "version": APP_VERSION})
            return
        if path == "/api/roster":
            query = parse_qs(parsed_url.query)
            code = query.get("code", [""])[0]
            team = TEAM_BY_CODE.get(code)
            if not team:
                self.send_json({"ok": False, "error": "Selecao nao encontrada."}, status=404)
                return
            try:
                players = fetch_roster(team)
                self.send_json(
                    {
                        "ok": True,
                        "team": team,
                        "players": players,
                        "count": len(players),
                        "source": SQUAD_SOURCE_URL,
                        "version": APP_VERSION,
                    }
                )
            except Exception as exc:
                self.send_json(
                    {
                        "ok": False,
                        "team": team,
                        "players": [],
                        "count": 0,
                        "error": "Elenco indisponivel no momento.",
                        "detail": str(exc),
                        "source": SQUAD_SOURCE_URL,
                        "version": APP_VERSION,
                    }
                )
            return
        if path == "/api/status":
            self.send_json({"app": APP_NAME, "version": APP_VERSION, "ok": True})
            return
        if path == "/":
            self.path = "/index.html"
        super().do_GET()

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
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

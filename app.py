from __future__ import annotations

import json
import os
import re
import time
import unicodedata
import urllib.request
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from zoneinfo import ZoneInfo


APP_NAME = "copa2026"
APP_VERSION = "2026.06.28-live-sync-v1"
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = BASE_DIR / "data"
FINAL_MATCHES_DB = DATA_DIR / "final_matches.json"
LIVE_SYNC_DB = DATA_DIR / "live_sync.json"
FIFA_TOURNAMENT_URL = "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
FIFA_SCORES_SOURCE_URL = f"{FIFA_TOURNAMENT_URL}/scores-fixtures"
FIFA_TEAMS_SOURCE_URL = f"{FIFA_TOURNAMENT_URL}/teams"
SQUAD_SOURCE_URL = FIFA_TEAMS_SOURCE_URL
SCORES_SOURCE_URL = FIFA_SCORES_SOURCE_URL
LIVE_POLL_SECONDS = 30
MATCHDAY_POLL_SECONDS = 300
DEFAULT_POLL_SECONDS = 900
SCORES_CACHE_SECONDS = DEFAULT_POLL_SECONDS
TIEBREAKER_RULES = {
    "group": [
        "points",
        "head_to_head_points",
        "head_to_head_goal_difference",
        "head_to_head_goals_for",
        "overall_goal_difference",
        "overall_goals_for",
        "team_conduct_score",
        "fifa_ranking",
    ],
    "general": [
        "points",
        "overall_goal_difference",
        "overall_goals_for",
        "team_conduct_score",
        "fifa_ranking",
    ],
}


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


TEAM_CONDUCT_SCORES = {
    # FIFA uses team conduct as a late tiebreaker. Keep zero until card data is available.
    team["code"]: 0 for team in TEAMS
}


FIFA_RANKINGS = {
    # Lower is better. Populate/update from FIFA rankings when available.
    team["code"]: 999 for team in TEAMS
}


TEAM_BY_CODE = {team["code"]: team for team in TEAMS}
ROSTER_CACHE: dict[str, list[dict[str, str]]] = {}
SCORES_CACHE: dict[str, object] = {"expires_at": 0.0, "scores": None, "source_ok": False, "error": ""}

GROUP_DEFINITIONS = [
    {"id": "A", "teams": ["mx", "za", "kr", "cz"]},
    {"id": "B", "teams": ["ca", "qa", "ch", "ba"]},
    {"id": "C", "teams": ["br", "ma", "ht", "gb-sct"]},
    {"id": "D", "teams": ["us", "py", "au", "tr"]},
    {"id": "E", "teams": ["de", "ci", "ec", "cw"]},
    {"id": "F", "teams": ["nl", "se", "tn", "jp"]},
    {"id": "G", "teams": ["be", "eg", "ir", "nz"]},
    {"id": "H", "teams": ["es", "uy", "sa", "cv"]},
    {"id": "I", "teams": ["fr", "sn", "iq", "no"]},
    {"id": "J", "teams": ["ar", "dz", "at", "jo"]},
    {"id": "K", "teams": ["pt", "cd", "uz", "co"]},
    {"id": "L", "teams": ["gb-eng", "hr", "gh", "pa"]},
]

SCORE_RESULTS = [
    {"group": "A", "date": "2026-06-11", "home": "mx", "home_score": 2, "away_score": 0, "away": "za", "stadium": "Estadio Azteca", "city": "Mexico City"},
    {"group": "A", "date": "2026-06-11", "home": "kr", "home_score": 2, "away_score": 1, "away": "cz", "stadium": "Estadio Akron", "city": "Zapopan"},
    {"group": "A", "date": "2026-06-18", "home": "cz", "home_score": 1, "away_score": 1, "away": "za", "stadium": "Mercedes-Benz Stadium", "city": "Atlanta"},
    {"group": "A", "date": "2026-06-18", "home": "mx", "home_score": 1, "away_score": 0, "away": "kr", "stadium": "Estadio Akron", "city": "Zapopan"},
    {"group": "A", "date": "2026-06-24", "home": "za", "home_score": 1, "away_score": 0, "away": "kr", "stadium": "Estadio BBVA", "city": "Guadalupe"},
    {"group": "A", "date": "2026-06-24", "home": "mx", "home_score": 3, "away_score": 0, "away": "cz", "stadium": "Estadio Azteca", "city": "Mexico City"},
    {"group": "B", "date": "2026-06-12", "home": "ca", "home_score": 1, "away_score": 1, "away": "ba", "stadium": "BMO Field", "city": "Toronto"},
    {"group": "B", "date": "2026-06-13", "home": "qa", "home_score": 1, "away_score": 1, "away": "ch", "stadium": "Levi's Stadium", "city": "Santa Clara"},
    {"group": "B", "date": "2026-06-18", "home": "ch", "home_score": 4, "away_score": 1, "away": "ba", "stadium": "SoFi Stadium", "city": "Inglewood"},
    {"group": "B", "date": "2026-06-18", "home": "ca", "home_score": 6, "away_score": 0, "away": "qa", "stadium": "BC Place", "city": "Vancouver"},
    {"group": "B", "date": "2026-06-24", "home": "ch", "home_score": 2, "away_score": 1, "away": "ca", "stadium": "BC Place", "city": "Vancouver"},
    {"group": "B", "date": "2026-06-24", "home": "ba", "home_score": 3, "away_score": 1, "away": "qa", "stadium": "Lumen Field", "city": "Seattle"},
    {"group": "C", "date": "2026-06-13", "home": "br", "home_score": 1, "away_score": 1, "away": "ma", "stadium": "MetLife Stadium", "city": "East Rutherford"},
    {"group": "C", "date": "2026-06-13", "home": "ht", "home_score": 0, "away_score": 1, "away": "gb-sct", "stadium": "Gillette Stadium", "city": "Foxborough"},
    {"group": "C", "date": "2026-06-19", "home": "gb-sct", "home_score": 0, "away_score": 1, "away": "ma", "stadium": "Gillette Stadium", "city": "Foxborough"},
    {"group": "C", "date": "2026-06-19", "home": "br", "home_score": 3, "away_score": 0, "away": "ht", "stadium": "Lincoln Financial Field", "city": "Philadelphia"},
    {"group": "C", "date": "2026-06-24", "home": "ma", "home_score": 4, "away_score": 2, "away": "ht", "stadium": "Mercedes-Benz Stadium", "city": "Atlanta"},
    {"group": "C", "date": "2026-06-24", "home": "br", "home_score": 3, "away_score": 0, "away": "gb-sct", "stadium": "Hard Rock Stadium", "city": "Miami Gardens"},
    {"group": "D", "date": "2026-06-12", "home": "us", "home_score": 4, "away_score": 1, "away": "py", "stadium": "SoFi Stadium", "city": "Inglewood"},
    {"group": "D", "date": "2026-06-13", "home": "au", "home_score": 2, "away_score": 0, "away": "tr", "stadium": "BC Place", "city": "Vancouver"},
    {"group": "D", "date": "2026-06-19", "home": "us", "home_score": 2, "away_score": 0, "away": "au", "stadium": "Lumen Field", "city": "Seattle"},
    {"group": "D", "date": "2026-06-19", "home": "tr", "home_score": 0, "away_score": 1, "away": "py", "stadium": "Levi's Stadium", "city": "Santa Clara"},
    {"group": "D", "date": "2026-06-25", "home": "tr", "home_score": 3, "away_score": 2, "away": "us", "stadium": "Los Angeles Stadium", "city": "Los Angeles"},
    {"group": "D", "date": "2026-06-25", "home": "py", "home_score": 0, "away_score": 0, "away": "au", "stadium": "San Francisco Bay Area Stadium", "city": "San Francisco Bay Area"},
    {"group": "E", "date": "2026-06-14", "home": "de", "home_score": 7, "away_score": 1, "away": "cw", "stadium": "NRG Stadium", "city": "Houston"},
    {"group": "E", "date": "2026-06-14", "home": "ci", "home_score": 1, "away_score": 0, "away": "ec", "stadium": "Lincoln Financial Field", "city": "Philadelphia"},
    {"group": "E", "date": "2026-06-20", "home": "de", "home_score": 2, "away_score": 1, "away": "ci", "stadium": "BMO Field", "city": "Toronto"},
    {"group": "E", "date": "2026-06-20", "home": "ec", "home_score": 0, "away_score": 0, "away": "cw", "stadium": "Arrowhead Stadium", "city": "Kansas City"},
    {"group": "E", "date": "2026-06-25", "home": "ci", "home_score": 2, "away_score": 0, "away": "cw", "stadium": "Lincoln Financial Field", "city": "Philadelphia"},
    {"group": "E", "date": "2026-06-25", "home": "ec", "home_score": 2, "away_score": 1, "away": "de", "stadium": "MetLife Stadium", "city": "East Rutherford"},
    {"group": "F", "date": "2026-06-14", "home": "nl", "home_score": 2, "away_score": 2, "away": "jp", "stadium": "AT&T Stadium", "city": "Arlington"},
    {"group": "F", "date": "2026-06-14", "home": "se", "home_score": 5, "away_score": 1, "away": "tn", "stadium": "Estadio BBVA", "city": "Guadalupe"},
    {"group": "F", "date": "2026-06-20", "home": "nl", "home_score": 5, "away_score": 1, "away": "se", "stadium": "NRG Stadium", "city": "Houston"},
    {"group": "F", "date": "2026-06-20", "home": "tn", "home_score": 0, "away_score": 4, "away": "jp", "stadium": "Estadio BBVA", "city": "Guadalupe"},
    {"group": "F", "date": "2026-06-25", "home": "jp", "home_score": 1, "away_score": 1, "away": "se", "stadium": "AT&T Stadium", "city": "Arlington"},
    {"group": "F", "date": "2026-06-25", "home": "nl", "home_score": 3, "away_score": 1, "away": "tn", "stadium": "Arrowhead Stadium", "city": "Kansas City"},
    {"group": "G", "date": "2026-06-15", "home": "be", "home_score": 1, "away_score": 1, "away": "eg", "stadium": "Lumen Field", "city": "Seattle"},
    {"group": "G", "date": "2026-06-15", "home": "ir", "home_score": 2, "away_score": 2, "away": "nz", "stadium": "SoFi Stadium", "city": "Inglewood"},
    {"group": "G", "date": "2026-06-21", "home": "be", "home_score": 0, "away_score": 0, "away": "ir", "stadium": "SoFi Stadium", "city": "Inglewood"},
    {"group": "G", "date": "2026-06-21", "home": "nz", "home_score": 1, "away_score": 3, "away": "eg", "stadium": "BC Place", "city": "Vancouver"},
    {"group": "G", "date": "2026-06-26", "home": "eg", "home_score": 1, "away_score": 1, "away": "ir", "stadium": "Seattle Stadium", "city": "Seattle"},
    {"group": "G", "date": "2026-06-26", "home": "nz", "home_score": 1, "away_score": 5, "away": "be", "stadium": "BC Place Vancouver", "city": "Vancouver"},
    {"group": "H", "date": "2026-06-15", "home": "es", "home_score": 0, "away_score": 0, "away": "cv", "stadium": "Mercedes-Benz Stadium", "city": "Atlanta"},
    {"group": "H", "date": "2026-06-15", "home": "sa", "home_score": 1, "away_score": 1, "away": "uy", "stadium": "Hard Rock Stadium", "city": "Miami Gardens"},
    {"group": "H", "date": "2026-06-21", "home": "es", "home_score": 4, "away_score": 0, "away": "sa", "stadium": "Mercedes-Benz Stadium", "city": "Atlanta"},
    {"group": "H", "date": "2026-06-21", "home": "uy", "home_score": 2, "away_score": 2, "away": "cv", "stadium": "Hard Rock Stadium", "city": "Miami Gardens"},
    {"group": "H", "date": "2026-06-26", "home": "cv", "home_score": 0, "away_score": 0, "away": "sa", "stadium": "Houston Stadium", "city": "Houston"},
    {"group": "H", "date": "2026-06-26", "home": "uy", "home_score": 0, "away_score": 1, "away": "es", "stadium": "Estadio Guadalajara", "city": "Guadalajara"},
    {"group": "I", "date": "2026-06-16", "home": "fr", "home_score": 3, "away_score": 1, "away": "sn", "stadium": "MetLife Stadium", "city": "East Rutherford"},
    {"group": "I", "date": "2026-06-16", "home": "iq", "home_score": 1, "away_score": 4, "away": "no", "stadium": "Gillette Stadium", "city": "Foxborough"},
    {"group": "I", "date": "2026-06-22", "home": "fr", "home_score": 3, "away_score": 0, "away": "iq", "stadium": "Lincoln Financial Field", "city": "Philadelphia"},
    {"group": "I", "date": "2026-06-22", "home": "no", "home_score": 3, "away_score": 2, "away": "sn", "stadium": "MetLife Stadium", "city": "East Rutherford"},
    {"group": "I", "date": "2026-06-26", "home": "no", "home_score": 1, "away_score": 4, "away": "fr", "stadium": "Boston Stadium", "city": "Boston"},
    {"group": "I", "date": "2026-06-26", "home": "sn", "home_score": 5, "away_score": 0, "away": "iq", "stadium": "Toronto Stadium", "city": "Toronto"},
    {"group": "J", "date": "2026-06-16", "home": "ar", "home_score": 3, "away_score": 0, "away": "dz", "stadium": "Arrowhead Stadium", "city": "Kansas City"},
    {"group": "J", "date": "2026-06-16", "home": "at", "home_score": 3, "away_score": 1, "away": "jo", "stadium": "Levi's Stadium", "city": "Santa Clara"},
    {"group": "J", "date": "2026-06-22", "home": "ar", "home_score": 2, "away_score": 0, "away": "at", "stadium": "AT&T Stadium", "city": "Arlington"},
    {"group": "J", "date": "2026-06-22", "home": "dz", "home_score": 2, "away_score": 1, "away": "jo", "stadium": "Levi's Stadium", "city": "Santa Clara"},
    {"group": "J", "date": "2026-06-27", "home": "dz", "home_score": 3, "away_score": 3, "away": "at", "stadium": "Kansas City Stadium", "city": "Kansas City"},
    {"group": "J", "date": "2026-06-27", "home": "jo", "home_score": 1, "away_score": 3, "away": "ar", "stadium": "Dallas Stadium", "city": "Dallas"},
    {"group": "K", "date": "2026-06-17", "home": "pt", "home_score": 1, "away_score": 1, "away": "cd", "stadium": "NRG Stadium", "city": "Houston"},
    {"group": "K", "date": "2026-06-17", "home": "uz", "home_score": 1, "away_score": 3, "away": "co", "stadium": "Estadio Azteca", "city": "Mexico City"},
    {"group": "K", "date": "2026-06-23", "home": "pt", "home_score": 5, "away_score": 0, "away": "uz", "stadium": "NRG Stadium", "city": "Houston"},
    {"group": "K", "date": "2026-06-23", "home": "co", "home_score": 1, "away_score": 0, "away": "cd", "stadium": "Estadio Akron", "city": "Zapopan"},
    {"group": "K", "date": "2026-06-27", "home": "co", "home_score": 0, "away_score": 0, "away": "pt", "stadium": "Miami Stadium", "city": "Miami"},
    {"group": "K", "date": "2026-06-27", "home": "cd", "home_score": 3, "away_score": 1, "away": "uz", "stadium": "Atlanta Stadium", "city": "Atlanta"},
    {"group": "L", "date": "2026-06-17", "home": "gb-eng", "home_score": 4, "away_score": 2, "away": "hr", "stadium": "AT&T Stadium", "city": "Arlington"},
    {"group": "L", "date": "2026-06-17", "home": "gh", "home_score": 1, "away_score": 0, "away": "pa", "stadium": "BMO Field", "city": "Toronto"},
    {"group": "L", "date": "2026-06-23", "home": "gb-eng", "home_score": 0, "away_score": 0, "away": "gh", "stadium": "Gillette Stadium", "city": "Foxborough"},
    {"group": "L", "date": "2026-06-23", "home": "hr", "home_score": 1, "away_score": 0, "away": "pa", "stadium": "BMO Field", "city": "Toronto"},
    {"group": "L", "date": "2026-06-27", "home": "pa", "home_score": 0, "away_score": 2, "away": "gb-eng", "stadium": "New York New Jersey Stadium", "city": "New York New Jersey"},
    {"group": "L", "date": "2026-06-27", "home": "hr", "home_score": 2, "away_score": 1, "away": "gh", "stadium": "Philadelphia Stadium", "city": "Philadelphia"},
]


def build_groups(include_standings: bool = False, scores: list[dict] | None = None) -> list[dict]:
    standings_by_group = build_all_group_standings(scores) if include_standings else {}
    groups = []
    for group in GROUP_DEFINITIONS:
        group_id = group["id"]
        groups.append(
            {
                "id": group_id,
                "name": f"Grupo {group_id}",
                "teams": [TEAM_BY_CODE[code] for code in group["teams"]],
                "standings": standings_by_group.get(group_id, []),
            }
        )
    return groups


OFFICIAL_STADIUM_NAMES = {
    "AT&T Stadium": "Dallas Stadium",
    "Arrowhead Stadium": "Kansas City Stadium",
    "BC Place": "BC Place Vancouver",
    "BMO Field": "Toronto Stadium",
    "Estadio Akron": "Estadio Guadalajara",
    "Estadio Azteca": "Mexico City Stadium",
    "Estadio BBVA": "Monterrey Stadium",
    "Gillette Stadium": "Boston Stadium",
    "Hard Rock Stadium": "Miami Stadium",
    "Levi's Stadium": "San Francisco Bay Area Stadium",
    "Lincoln Financial Field": "Philadelphia Stadium",
    "Lumen Field": "Seattle Stadium",
    "Mercedes-Benz Stadium": "Atlanta Stadium",
    "MetLife Stadium": "New York New Jersey Stadium",
    "NRG Stadium": "Houston Stadium",
    "SoFi Stadium": "Los Angeles Stadium",
}

OFFICIAL_HOST_LOCATIONS = {
    "AT&T Stadium": "Dallas",
    "Arrowhead Stadium": "Kansas City",
    "BC Place": "Vancouver",
    "BMO Field": "Toronto",
    "Estadio Akron": "Guadalajara",
    "Estadio Azteca": "Mexico City",
    "Estadio BBVA": "Monterrey",
    "Gillette Stadium": "Boston",
    "Hard Rock Stadium": "Miami",
    "Levi's Stadium": "San Francisco Bay Area",
    "Lincoln Financial Field": "Philadelphia",
    "Lumen Field": "Seattle",
    "Mercedes-Benz Stadium": "Atlanta",
    "MetLife Stadium": "New York New Jersey",
    "NRG Stadium": "Houston",
    "SoFi Stadium": "Los Angeles",
}

OFFICIAL_HOST_LOCATIONS.update(
    {official_stadium: OFFICIAL_HOST_LOCATIONS[commercial_stadium] for commercial_stadium, official_stadium in OFFICIAL_STADIUM_NAMES.items()}
)


def official_stadium_name(stadium: str | None) -> str:
    if not stadium:
        return ""
    return OFFICIAL_STADIUM_NAMES.get(stadium, stadium)


def official_host_location(stadium: str | None, city: str | None) -> str:
    if stadium and stadium in OFFICIAL_HOST_LOCATIONS:
        return OFFICIAL_HOST_LOCATIONS[stadium]
    return city or ""


def enrich_score(result: dict) -> dict:
    home = TEAM_BY_CODE[result["home"]]
    away = TEAM_BY_CODE[result["away"]]
    stadium = official_stadium_name(result.get("stadium", ""))
    return {
        **result,
        "stadium": stadium,
        "city": official_host_location(stadium, result.get("city", "")),
        "group_name": f"Grupo {result['group']}",
        "home_team": home,
        "away_team": away,
    }


def final_match_db_template() -> dict:
    return {
        "source": {
            "name": "FIFA.com",
            "url": FIFA_SCORES_SOURCE_URL,
            "last_seeded": "2026-06-28",
            "policy": "Jogos encerrados confirmados ficam gravados neste banco local versionado.",
        },
        "matches": SCORE_RESULTS,
    }


def normalize_finished_match_record(match: dict) -> dict:
    return {
        "group": match["group"],
        "date": match["date"],
        "home": match["home"],
        "home_score": int(match["home_score"]),
        "away_score": int(match["away_score"]),
        "away": match["away"],
        "stadium": official_stadium_name(match.get("stadium", "")),
        "city": official_host_location(match.get("stadium", ""), match.get("city", "")),
        "status": "finished",
        "source": match.get("source") or FIFA_SCORES_SOURCE_URL,
        "verified_by": match.get("verified_by") or "FIFA.com",
    }


def load_final_matches_db() -> dict:
    if not FINAL_MATCHES_DB.exists():
        return final_match_db_template()
    try:
        payload = json.loads(FINAL_MATCHES_DB.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return final_match_db_template()
    if not isinstance(payload, dict) or not isinstance(payload.get("matches"), list):
        return final_match_db_template()
    payload.setdefault("source", final_match_db_template()["source"])
    return payload


def save_final_matches_db(matches: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    payload = {
        "source": {
            "name": "FIFA.com",
            "url": FIFA_SCORES_SOURCE_URL,
            "last_saved": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "policy": "Banco local de jogos encerrados: preserva resultados oficiais ja concluidos caso a pagina da FIFA mude ou fique indisponivel.",
        },
        "matches": [normalize_finished_match_record(match) for match in matches],
    }
    temporary_path = FINAL_MATCHES_DB.with_suffix(".json.tmp")
    temporary_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary_path.replace(FINAL_MATCHES_DB)


def load_finished_match_records() -> list[dict]:
    payload = load_final_matches_db()
    records: list[dict] = []
    for match in payload.get("matches", []):
        if not isinstance(match, dict):
            continue
        try:
            records.append(normalize_finished_match_record(match))
        except (KeyError, TypeError, ValueError):
            continue
    return records


def build_scores() -> list[dict]:
    return [enrich_score(result) for result in load_finished_match_records()]


KNOCKOUT_FIXTURE_SOURCE = {
    "name": "FIFA.com",
    "url": FIFA_SCORES_SOURCE_URL,
    "last_verified": "2026-06-28",
    "policy": "Calendario oficial FIFA como fonte primaria; banco local preserva jogos encerrados e locais ja confirmados.",
}

KNOCKOUT_ROUND_OF_32_FIXTURES = [
    {"id": 73, "date": "2026-06-28", "time": "16:00 BRT", "stadium": "Los Angeles Stadium", "city": "Los Angeles", "source": FIFA_SCORES_SOURCE_URL},
    {"id": 74, "date": "2026-06-29", "time": "17:30 BRT", "stadium": "Boston Stadium", "city": "Boston", "source": FIFA_SCORES_SOURCE_URL},
    {"id": 76, "date": "2026-06-29", "time": "14:00 BRT", "stadium": "Houston Stadium", "city": "Houston", "source": FIFA_SCORES_SOURCE_URL},
    {"id": 77, "date": "2026-06-30", "time": "18:00 BRT", "stadium": "New York New Jersey Stadium", "city": "New York New Jersey", "source": FIFA_SCORES_SOURCE_URL},
    {"id": 86, "date": "2026-07-03", "time": "19:00 BRT", "stadium": "Miami Stadium", "city": "Miami", "source": FIFA_SCORES_SOURCE_URL},
]


def build_knockout_fixtures() -> dict:
    return {
        "source": KNOCKOUT_FIXTURE_SOURCE,
        "round_of_32": KNOCKOUT_ROUND_OF_32_FIXTURES,
    }


def brt_now() -> datetime:
    return datetime.now(ZoneInfo("America/Fortaleza"))


def iso_utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def parse_brt_match_start(date_value: str, time_value: str) -> datetime | None:
    match = re.search(r"(\d{1,2}):(\d{2})", time_value or "")
    if not match:
        return None
    try:
        hour = int(match.group(1))
        minute = int(match.group(2))
        year, month, day = [int(part) for part in date_value.split("-")]
        return datetime(year, month, day, hour, minute, tzinfo=ZoneInfo("America/Fortaleza"))
    except (ValueError, AttributeError):
        return None


def scheduled_sync_matches() -> list[dict]:
    matches = []
    for fixture in KNOCKOUT_ROUND_OF_32_FIXTURES:
        starts_at = parse_brt_match_start(fixture.get("date", ""), fixture.get("time", ""))
        if not starts_at:
            continue
        matches.append(
            {
                "id": fixture.get("id"),
                "date": fixture.get("date"),
                "time": fixture.get("time"),
                "stadium": fixture.get("stadium", ""),
                "starts_at_brt": starts_at.isoformat(),
                "starts_at": starts_at,
            }
        )
    return matches


def build_live_sync_policy(now: datetime | None = None) -> dict:
    now = now or brt_now()
    active_matches = []
    today_matches = []
    upcoming_matches = []

    for match in scheduled_sync_matches():
        starts_at = match["starts_at"]
        if starts_at - timedelta(minutes=15) <= now <= starts_at + timedelta(minutes=150):
            active_matches.append(match)
        if starts_at.date() == now.date():
            today_matches.append(match)
        if starts_at >= now:
            upcoming_matches.append(match)

    if active_matches:
        interval_seconds = LIVE_POLL_SECONDS
        mode = "live"
        reason = "Jogo em andamento ou dentro da janela de atualizacao ao vivo."
    elif today_matches or (upcoming_matches and upcoming_matches[0]["starts_at"] - now <= timedelta(hours=24)):
        interval_seconds = MATCHDAY_POLL_SECONDS
        mode = "matchday"
        reason = "Dia de jogo ou partida dentro das proximas 24 horas."
    else:
        interval_seconds = DEFAULT_POLL_SECONDS
        mode = "routine"
        reason = "Sem jogo imediato; consulta em ritmo de rotina."

    next_match = upcoming_matches[0] if upcoming_matches else None
    serializable_active = [{key: value for key, value in match.items() if key != "starts_at"} for match in active_matches]
    serializable_next = {key: value for key, value in next_match.items() if key != "starts_at"} if next_match else None
    return {
        "mode": mode,
        "reason": reason,
        "interval_seconds": interval_seconds,
        "now_brt": now.isoformat(),
        "active_matches": serializable_active,
        "next_match": serializable_next,
        "source": FIFA_SCORES_SOURCE_URL,
    }


def save_live_sync_status(status: dict) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    temporary_path = LIVE_SYNC_DB.with_suffix(".json.tmp")
    temporary_path.write_text(json.dumps(status, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary_path.replace(LIVE_SYNC_DB)


def load_live_sync_status() -> dict:
    if not LIVE_SYNC_DB.exists():
        return {}
    try:
        payload = json.loads(LIVE_SYNC_DB.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return payload if isinstance(payload, dict) else {}


def build_official_source_status(score_source: dict | None = None) -> dict:
    final_db = load_final_matches_db()
    return {
        "primary": "FIFA.com",
        "scores_url": FIFA_SCORES_SOURCE_URL,
        "teams_url": FIFA_TEAMS_SOURCE_URL,
        "album_exception": "Album de figurinhas da selecao japonesa mantem fonte japonesa propria.",
        "final_db": str(FINAL_MATCHES_DB.relative_to(BASE_DIR)),
        "final_db_count": len(final_db.get("matches", [])),
        "live_sync": load_live_sync_status(),
        "score_source": score_source or {},
    }


TEAM_NAME_ALIASES = {
    "algeria": "dz",
    "argentina": "ar",
    "australia": "au",
    "austria": "at",
    "belgium": "be",
    "bosnia and herzegovina": "ba",
    "brazil": "br",
    "canada": "ca",
    "cabo verde": "cv",
    "cape verde": "cv",
    "colombia": "co",
    "cote d ivoire": "ci",
    "côte d ivoire": "ci",
    "croatia": "hr",
    "curacao": "cw",
    "curaçao": "cw",
    "czechia": "cz",
    "czech republic": "cz",
    "dr congo": "cd",
    "ecuador": "ec",
    "egypt": "eg",
    "england": "gb-eng",
    "france": "fr",
    "germany": "de",
    "ghana": "gh",
    "haiti": "ht",
    "iran": "ir",
    "ir iran": "ir",
    "iraq": "iq",
    "ivory coast": "ci",
    "japan": "jp",
    "jordan": "jo",
    "mexico": "mx",
    "morocco": "ma",
    "netherlands": "nl",
    "new zealand": "nz",
    "norway": "no",
    "panama": "pa",
    "paraguay": "py",
    "portugal": "pt",
    "qatar": "qa",
    "saudi arabia": "sa",
    "scotland": "gb-sct",
    "senegal": "sn",
    "south africa": "za",
    "south korea": "kr",
    "korea republic": "kr",
    "spain": "es",
    "sweden": "se",
    "switzerland": "ch",
    "tunisia": "tn",
    "turkiye": "tr",
    "türkiye": "tr",
    "turkey": "tr",
    "united states": "us",
    "usa": "us",
    "uruguay": "uy",
    "uzbekistan": "uz",
}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        text = clean_text(data)
        if text:
            self.parts.append(text)


def code_from_source_team_name(name: str) -> str | None:
    return TEAM_NAME_ALIASES.get(normalize_key(name))


def result_key(result: dict) -> tuple[str, str, str]:
    teams = sorted([result["home"], result["away"]])
    return (result["group"], teams[0], teams[1])


SCHEDULED_MATCH_LOCATIONS = {
    ("D", "au", "py"): ("San Francisco Bay Area Stadium", "San Francisco Bay Area"),
    ("D", "tr", "us"): ("Los Angeles Stadium", "Los Angeles"),
    ("E", "ci", "cw"): ("Philadelphia Stadium", "Philadelphia"),
    ("E", "de", "ec"): ("New York New Jersey Stadium", "New York New Jersey"),
    ("F", "jp", "se"): ("Dallas Stadium", "Dallas"),
    ("F", "nl", "tn"): ("Kansas City Stadium", "Kansas City"),
    ("G", "eg", "ir"): ("Seattle Stadium", "Seattle"),
    ("G", "be", "nz"): ("BC Place Vancouver", "Vancouver"),
    ("H", "cv", "sa"): ("Houston Stadium", "Houston"),
    ("H", "es", "uy"): ("Estadio Guadalajara", "Guadalajara"),
    ("I", "fr", "no"): ("Boston Stadium", "Boston"),
    ("I", "iq", "sn"): ("Toronto Stadium", "Toronto"),
    ("J", "at", "dz"): ("Kansas City Stadium", "Kansas City"),
    ("J", "ar", "jo"): ("Dallas Stadium", "Dallas"),
    ("K", "co", "pt"): ("Miami Stadium", "Miami"),
    ("K", "cd", "uz"): ("Atlanta Stadium", "Atlanta"),
    ("L", "gb-eng", "pa"): ("New York New Jersey Stadium", "New York New Jersey"),
    ("L", "gh", "hr"): ("Philadelphia Stadium", "Philadelphia"),
}


UNKNOWN_FINISHED_STADIUM = "Local oficial em atualizacao"
UNKNOWN_FINISHED_CITY = "Fonte oficial em verificacao"


def scheduled_match_location(result: dict) -> tuple[str, str] | None:
    return SCHEDULED_MATCH_LOCATIONS.get(result_key(result))


def complete_score_location(score: dict, local_score: dict | None = None) -> dict:
    local_score = local_score or {}
    stadium = score.get("stadium") or local_score.get("stadium", "")
    city = score.get("city") or local_score.get("city", "")
    if not stadium:
        scheduled_location = scheduled_match_location(score)
        if scheduled_location:
            stadium, city = scheduled_location
    if not stadium:
        stadium, city = UNKNOWN_FINISHED_STADIUM, UNKNOWN_FINISHED_CITY

    stadium = official_stadium_name(stadium)
    score["stadium"] = stadium
    score["city"] = official_host_location(stadium, city)
    return score


def merge_scores(local_scores: list[dict], external_scores: list[dict]) -> list[dict]:
    merged = {result_key(score): score for score in local_scores}
    for score in external_scores:
        key = result_key(score)
        local_score = merged.get(key, {})
        if local_score and score_is_finished(local_score):
            merged[key] = complete_score_location(enrich_score(local_score))
            continue
        enriched_score = enrich_score(score)
        enriched_score = complete_score_location(enriched_score, local_score)
        merged[key] = enriched_score
    return sorted(
        merged.values(),
        key=lambda score: (score["group"], score.get("date", ""), score["home"], score["away"]),
    )


def parse_external_scores_from_text(lines: list[str]) -> list[dict]:
    scores: list[dict] = []
    current_group = ""
    current_date = ""

    for line in lines:
        group_match = re.fullmatch(r"Group ([A-L]) schedule", line, flags=re.IGNORECASE)
        if group_match:
            current_group = group_match.group(1).upper()
            current_date = ""
            continue

        if not current_group:
            continue

        date_match = re.fullmatch(r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), June (\d{1,2})", line)
        if date_match:
            current_date = f"2026-06-{int(date_match.group(2)):02d}"
            continue

        result_match = re.fullmatch(r"(.+?) (\d+), (.+?) (\d+)", line)
        if not result_match or not current_date:
            continue

        home_code = code_from_source_team_name(result_match.group(1))
        away_code = code_from_source_team_name(result_match.group(3))
        if not home_code or not away_code:
            continue

        scores.append(
            {
                "group": current_group,
                "date": current_date,
                "home": home_code,
                "home_score": int(result_match.group(2)),
                "away_score": int(result_match.group(4)),
                "away": away_code,
                "stadium": "",
                "city": "",
                "source": SCORES_SOURCE_URL,
            }
        )

    return scores


def fetch_external_scores(force_refresh: bool = False) -> tuple[list[dict], bool, str]:
    now = time.time()
    sync_policy = build_live_sync_policy()
    interval_seconds = int(sync_policy["interval_seconds"])
    cached_scores = SCORES_CACHE.get("scores")
    cached_policy = SCORES_CACHE.get("sync_policy") if isinstance(SCORES_CACHE.get("sync_policy"), dict) else {}
    mode_changed = cached_policy.get("mode") and cached_policy.get("mode") != sync_policy["mode"]
    interval_got_shorter = int(cached_policy.get("interval_seconds") or interval_seconds) > interval_seconds
    if cached_scores is not None and now < float(SCORES_CACHE["expires_at"]) and not mode_changed and not interval_got_shorter:
        return cached_scores, bool(SCORES_CACHE["source_ok"]), str(SCORES_CACHE.get("error") or "")

    try:
        request = urllib.request.Request(
            FIFA_SCORES_SOURCE_URL,
            headers={"User-Agent": f"{APP_NAME}/{APP_VERSION} fifa official source monitor"},
        )
        with urllib.request.urlopen(request, timeout=8) as response:
            html = response.read().decode("utf-8", errors="replace")
        parser = TextExtractor()
        parser.feed(html)
        scores = parse_external_scores_from_text(parser.parts)
        status = {
            **sync_policy,
            "ok": True,
            "error": "",
            "last_checked": iso_utc_now(),
            "last_success": iso_utc_now(),
            "external_count": len(scores),
            "fallback_used": not bool(scores),
            "next_check_seconds": interval_seconds,
            "force_refresh_requested": force_refresh,
        }
        save_live_sync_status(status)
        SCORES_CACHE.update(
            {
                "expires_at": now + interval_seconds,
                "scores": scores,
                "source_ok": True,
                "error": "",
                "sync_policy": status,
            }
        )
        return scores, True, ""
    except Exception as exc:
        previous_status = load_live_sync_status()
        status = {
            **sync_policy,
            "ok": False,
            "error": str(exc),
            "last_checked": iso_utc_now(),
            "last_success": previous_status.get("last_success", ""),
            "external_count": 0,
            "fallback_used": True,
            "next_check_seconds": min(interval_seconds, 60),
            "force_refresh_requested": force_refresh,
        }
        save_live_sync_status(status)
        SCORES_CACHE.update(
            {
                "expires_at": now + min(interval_seconds, 60),
                "scores": [],
                "source_ok": False,
                "error": str(exc),
                "sync_policy": status,
            }
        )
        return [], False, str(exc)


def build_current_scores(force_refresh: bool = False) -> tuple[list[dict], dict]:
    local_scores = build_scores()
    external_scores, source_ok, source_error = fetch_external_scores(force_refresh=force_refresh)
    scores = merge_scores(local_scores, external_scores) if external_scores else local_scores
    finished_scores = [score for score in scores if score_is_finished(score)]
    if external_scores:
        save_final_matches_db(finished_scores)
    final_db = load_final_matches_db()
    live_sync = load_live_sync_status()
    return scores, {
        "name": "FIFA.com",
        "url": FIFA_SCORES_SOURCE_URL,
        "primary": "fifa.com",
        "ok": source_ok,
        "error": source_error,
        "external_count": len(external_scores),
        "final_db": str(FINAL_MATCHES_DB.relative_to(BASE_DIR)),
        "final_db_count": len(final_db.get("matches", [])),
        "fallback_used": not bool(external_scores),
        "fallback_reason": "Banco local de jogos encerrados usado para preservar dados oficiais." if not external_scores else "",
        "cache_seconds": live_sync.get("interval_seconds", DEFAULT_POLL_SECONDS),
        "live_sync": live_sync,
        "force_refresh": force_refresh,
    }


def score_is_finished(score: dict) -> bool:
    status = score.get("status", "finished")
    has_home_score = isinstance(score.get("home_score"), int)
    has_away_score = isinstance(score.get("away_score"), int)
    return status == "finished" and has_home_score and has_away_score


def empty_standing(team: dict) -> dict:
    return {
        "team": team,
        "played": 0,
        "wins": 0,
        "draws": 0,
        "losses": 0,
        "goalsFor": 0,
        "goalsAgainst": 0,
        "goalDifference": 0,
        "points": 0,
        "position": 0,
        "teamConductScore": TEAM_CONDUCT_SCORES.get(team["code"], 0),
        "fifaRanking": FIFA_RANKINGS.get(team["code"], 999),
    }


def apply_score_to_standing(row: dict, goals_for: int, goals_against: int) -> None:
    row["played"] += 1
    row["goalsFor"] += goals_for
    row["goalsAgainst"] += goals_against
    row["goalDifference"] = row["goalsFor"] - row["goalsAgainst"]

    if goals_for > goals_against:
        row["wins"] += 1
        row["points"] += 3
    elif goals_for == goals_against:
        row["draws"] += 1
        row["points"] += 1
    else:
        row["losses"] += 1


def apply_score_to_head_to_head(table: dict[str, dict], team_code: str, goals_for: int, goals_against: int) -> None:
    row = table[team_code]
    row["points"] += 3 if goals_for > goals_against else 1 if goals_for == goals_against else 0
    row["goalsFor"] += goals_for
    row["goalsAgainst"] += goals_against
    row["goalDifference"] = row["goalsFor"] - row["goalsAgainst"]


def head_to_head_table(team_codes: set[str], scores: list[dict]) -> dict[str, dict]:
    table = {
        code: {
            "points": 0,
            "goalsFor": 0,
            "goalsAgainst": 0,
            "goalDifference": 0,
        }
        for code in team_codes
    }

    for score in scores:
        if not score_is_finished(score) or score["home"] not in team_codes or score["away"] not in team_codes:
            continue
        apply_score_to_head_to_head(table, score["home"], score["home_score"], score["away_score"])
        apply_score_to_head_to_head(table, score["away"], score["away_score"], score["home_score"])

    return table


def group_tiebreak_key(row: dict, h2h: dict[str, dict]) -> tuple:
    code = row["team"]["code"]
    head_to_head = h2h.get(code, {})
    return (
        -head_to_head.get("points", 0),
        -head_to_head.get("goalDifference", 0),
        -head_to_head.get("goalsFor", 0),
        -row["goalDifference"],
        -row["goalsFor"],
        -row["teamConductScore"],
        row["fifaRanking"],
        row["team"]["country"],
    )


def rank_tied_group_rows(rows: list[dict], scores: list[dict]) -> list[dict]:
    if len(rows) <= 1:
        return rows
    team_codes = {row["team"]["code"] for row in rows}
    return sorted(rows, key=lambda row: group_tiebreak_key(row, head_to_head_table(team_codes, scores)))


def sort_group_standings(rows: list[dict], scores: list[dict]) -> list[dict]:
    ordered: list[dict] = []
    point_groups: dict[int, list[dict]] = {}
    for row in rows:
        point_groups.setdefault(row["points"], []).append(row)

    for points in sorted(point_groups, reverse=True):
        ordered.extend(rank_tied_group_rows(point_groups[points], scores))

    for index, row in enumerate(ordered, start=1):
        row["position"] = index
    return ordered


def sort_general_standings(rows: list[dict]) -> list[dict]:
    ordered = sorted(rows, key=general_standings_key)
    for index, row in enumerate(ordered, start=1):
        row["position"] = index
    return ordered


def general_standings_key(row: dict) -> tuple:
    return (
        -row["points"],
        -row["goalDifference"],
        -row["goalsFor"],
        -row["teamConductScore"],
        row["fifaRanking"],
        row["team"]["country"],
    )


def build_group_standings(group: dict, scores: list[dict] | None = None) -> list[dict]:
    scores = scores if scores is not None else build_scores()
    table = {code: empty_standing(TEAM_BY_CODE[code]) for code in group["teams"]}

    for score in scores:
        if score["group"] != group["id"] or not score_is_finished(score):
            continue
        home_row = table[score["home"]]
        away_row = table[score["away"]]
        apply_score_to_standing(home_row, score["home_score"], score["away_score"])
        apply_score_to_standing(away_row, score["away_score"], score["home_score"])

    group_scores = [score for score in scores if score["group"] == group["id"]]
    return sort_group_standings(list(table.values()), group_scores)


def build_all_group_standings(scores: list[dict] | None = None) -> dict[str, list[dict]]:
    scores = scores if scores is not None else build_scores()
    return {group["id"]: build_group_standings(group, scores) for group in GROUP_DEFINITIONS}


def build_general_standings(scores: list[dict] | None = None) -> list[dict]:
    standings_by_group = build_all_group_standings(scores)
    rows = [row for standings in standings_by_group.values() for row in standings]
    return sort_general_standings(rows)

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

FEDERATION_COUNTRY_NAMES = {
    "Albanian Football Association": "Albania",
    "Argentine Football Association": "Argentina",
    "Brazilian Football Confederation": "Brasil",
    "Bulgarian Football Union": "Bulgaria",
    "Croatian Football Federation": "Croacia",
    "Danish Football Association": "Dinamarca",
    "English Football Association": "Inglaterra",
    "Football Association of the Czech Republic": "Republica Tcheca",
    "French Football Federation": "Franca",
    "German Football Association": "Alemanha",
    "Hellenic Football Federation": "Grecia",
    "Italian Football Federation": "Italia",
    "Mexican Football Federation": "Mexico",
    "Portuguese Football Federation": "Portugal",
    "Royal Belgian Football Association": "Belgica",
    "Royal Dutch Football Association": "Paises Baixos",
    "Royal Spanish Football Federation": "Espanha",
    "Russian Football Union": "Russia",
    "Saudi Arabian Football Federation": "Arabia Saudita",
    "Scottish Football Association": "Escocia",
    "Swiss Football Association": "Suica",
    "The Football Association": "Inglaterra",
    "Turkish Football Federation": "Turquia",
    "Ukrainian Association of Football": "Ucrania",
    "United States Soccer Federation": "Estados Unidos",
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


def normalize_asset_url(url: str) -> str:
    if url.startswith("//"):
        return f"https:{url}"
    return url


def country_from_federation(federation: str) -> str:
    return FEDERATION_COUNTRY_NAMES.get(federation, federation)


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
        self.cell_flag_alt: str | None = None
        self.cell_flag_src: str | None = None
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
            self.cell_flag_alt = None
            self.cell_flag_src = None
            return
        if self.cell_text is not None and tag == "img":
            attrs_dict = dict(attrs)
            if attrs_dict.get("alt") and self.cell_flag_alt is None:
                self.cell_flag_alt = attrs_dict["alt"]
            if attrs_dict.get("src") and self.cell_flag_src is None:
                self.cell_flag_src = normalize_asset_url(attrs_dict["src"])

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
                cell_value = clean_text("".join(self.cell_text))
                if self.cell_flag_alt or self.cell_flag_src:
                    cell_value = f"{cell_value} [[flag_alt:{self.cell_flag_alt or ''}]] [[flag_src:{self.cell_flag_src or ''}]]"
                self.row.append(cell_value)
            self.cell_text = None
            self.cell_flag_alt = None
            self.cell_flag_src = None
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
    club_cell = cells[-1]
    flag_alt_match = re.search(r"\[\[flag_alt:(.*?)\]\]", club_cell)
    flag_src_match = re.search(r"\[\[flag_src:(.*?)\]\]", club_cell)
    club = clean_text(re.sub(r"\s*\[\[flag_(?:alt|src):.*?\]\]", "", club_cell))
    club = expand_club_name(club)
    club_country = country_from_federation(flag_alt_match.group(1)) if flag_alt_match else ""
    club_flag = flag_src_match.group(1) if flag_src_match else ""
    if not name or not club or not position_match:
        return None
    return {
        "number": cells[0],
        "position": position_match.group(1),
        "name": name,
        "club": club,
        "club_country": club_country,
        "club_flag": club_flag,
    }


def fetch_roster(team: dict, force_refresh: bool = False) -> list[dict[str, str]]:
    code = team["code"]
    if not force_refresh and code in ROSTER_CACHE:
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

    @staticmethod
    def should_force_refresh(parsed_url) -> bool:
        query = parse_qs(parsed_url.query)
        return query.get("fresh", ["0"])[0] == "1" or "t" in query

    def do_GET(self) -> None:
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        if path == "/api/teams":
            self.send_json({"teams": TEAMS, "count": len(TEAMS), "version": APP_VERSION})
            return
        if path == "/api/groups":
            scores, score_source = build_current_scores(force_refresh=self.should_force_refresh(parsed_url))
            groups = build_groups(include_standings=True, scores=scores)
            self.send_json(
                {
                    "groups": groups,
                    "count": len(groups),
                    "score_source": score_source,
                    "official_source": build_official_source_status(score_source),
                    "tiebreakers": TIEBREAKER_RULES,
                    "version": APP_VERSION,
                }
            )
            return
        if path == "/api/scores":
            scores, score_source = build_current_scores(force_refresh=self.should_force_refresh(parsed_url))
            finished_scores = [score for score in scores if score_is_finished(score)]
            self.send_json(
                {
                    "scores": scores,
                    "count": len(scores),
                    "finished_count": len(finished_scores),
                    "standings": {
                        "groups": build_all_group_standings(scores),
                        "general": build_general_standings(scores),
                    },
                    "knockout_fixtures": build_knockout_fixtures(),
                    "score_source": score_source,
                    "official_source": build_official_source_status(score_source),
                    "tiebreakers": TIEBREAKER_RULES,
                    "version": APP_VERSION,
                }
            )
            return
        if path == "/api/knockout-fixtures":
            self.send_json({"knockout_fixtures": build_knockout_fixtures(), "version": APP_VERSION})
            return
        if path == "/api/source-status":
            scores, score_source = build_current_scores(force_refresh=self.should_force_refresh(parsed_url))
            self.send_json(
                {
                    "ok": True,
                    "official_source": build_official_source_status(score_source),
                    "finished_count": len([score for score in scores if score_is_finished(score)]),
                    "version": APP_VERSION,
                }
            )
            return
        if path == "/api/live-sync":
            scores, score_source = build_current_scores(force_refresh=self.should_force_refresh(parsed_url))
            live_sync = score_source.get("live_sync") or load_live_sync_status() or build_live_sync_policy()
            self.send_json(
                {
                    "ok": True,
                    "live_sync": live_sync,
                    "score_source": score_source,
                    "finished_count": len([score for score in scores if score_is_finished(score)]),
                    "version": APP_VERSION,
                }
            )
            return
        if path == "/api/roster":
            query = parse_qs(parsed_url.query)
            code = query.get("code", [""])[0]
            team = TEAM_BY_CODE.get(code)
            if not team:
                self.send_json({"ok": False, "error": "Selecao nao encontrada."}, status=404)
                return
            try:
                players = fetch_roster(team, force_refresh=self.should_force_refresh(parsed_url))
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

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


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

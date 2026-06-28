const scoresGrid = document.querySelector("#scoresGrid");
const matchCount = document.querySelector("#matchCount");
const scoreTitle = document.querySelector("#scoreTitle");
const groupStandings = document.querySelector("#groupStandings");
const initialGroup = new URLSearchParams(window.location.search).get("group") || "";
const isGroupMode = Boolean(initialGroup);
const APP_DATA_VERSION = "20260628-fifa-source-v1";
const POLL_INTERVAL_MS = 60000;

const state = {
  matches: [],
  standings: null,
  group: initialGroup.toUpperCase(),
  updatedAt: "",
  pollTimer: null,
};

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function statusFor(match) {
  if (match.status) return match.status;
  return "finished";
}

function statusLabel(status) {
  if (status === "live") return "AO VIVO";
  if (status === "next") return "PROXIMO";
  return "ENCERRADO";
}

function statusClass(status) {
  if (status === "live") return "is-live";
  if (status === "next") return "is-next";
  return "is-finished";
}

function venueText(match, field) {
  if (match[field]) return match[field];
  return statusFor(match) === "finished" ? "Local oficial em atualizacao" : "A definir";
}

function searchable(match) {
  return normalizeText([
    match.group,
    match.city,
    match.stadium,
    match.home_team?.country,
    match.away_team?.country,
    match.home_team?.name,
    match.away_team?.name,
  ].join(" "));
}

function enrichMatch(match, index) {
  const status = statusFor(match);
  const possessionBase = 48 + ((index * 7) % 13);
  return {
    ...match,
    id: `${match.group}-${match.home}-${match.away}-${match.date}`,
    status,
    minute: status === "live" ? `${58 + (index % 25)}'` : "",
    shotsHome: 6 + ((index * 3) % 9),
    shotsAway: 5 + ((index * 5) % 8),
    possessionHome: possessionBase,
    possessionAway: 100 - possessionBase,
  };
}

function filterMatches() {
  return state.matches.filter((match) => {
    return !state.group || match.group === state.group;
  });
}

function hasFinalScore(match) {
  return Number.isFinite(Number(match.home_score)) && Number.isFinite(Number(match.away_score));
}

function isFinishedMatch(match) {
  return statusFor(match) === "finished" && hasFinalScore(match);
}

function finishedMatches(matches) {
  return matches.filter(isFinishedMatch);
}

function clearFrozenSnapshots() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("copa2026:first-round:"))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    // Storage can be blocked in private or restricted browser contexts.
  }
}

function emptyStanding(team) {
  return {
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function applyResult(table, team, goalsFor, goalsAgainst) {
  const row = table.get(team.code) || emptyStanding(team);
  row.played += 1;
  row.goalsFor += goalsFor;
  row.goalsAgainst += goalsAgainst;
  row.goalDifference = row.goalsFor - row.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    row.wins += 1;
    row.points += 3;
  } else if (goalsFor === goalsAgainst) {
    row.draws += 1;
    row.points += 1;
  } else {
    row.losses += 1;
  }

  table.set(team.code, row);
}

function buildStandings(matches) {
  const table = new Map();

  matches.forEach((match) => {
    table.set(match.home_team.code, table.get(match.home_team.code) || emptyStanding(match.home_team));
    table.set(match.away_team.code, table.get(match.away_team.code) || emptyStanding(match.away_team));
    applyResult(table, match.home_team, Number(match.home_score), Number(match.away_score));
    applyResult(table, match.away_team, Number(match.away_score), Number(match.home_score));
  });

  return [...table.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.country.localeCompare(b.team.country);
  });
}

function renderStandings(matches) {
  const groupLabel = state.group ? `Grupo ${state.group}` : "Classificacao Geral";
  const standings =
    (state.group ? state.standings?.groups?.[state.group] : state.standings?.general) ||
    buildStandings(matches);

  if (!standings.length) {
    groupStandings.innerHTML = `
      <div class="standings-empty">
        <strong>Pontuacao indisponivel</strong>
        <span>Nenhuma partida finalizada encontrada para este grupo.</span>
      </div>
    `;
    return;
  }

  groupStandings.innerHTML = `
    <div class="standings-head">
      <div>
        <span>${state.group ? "Classificacao do grupo" : "Classificacao geral"}</span>
        <strong>${groupLabel}</strong>
      </div>
      <small>Atualizado com jogos encerrados</small>
    </div>
    <div class="standings-table" role="table" aria-label="Pontuacao das selecoes do ${groupLabel}">
      <div class="standings-row standings-row-head" role="row">
        <span>Sel.</span>
        <span>J</span>
        <span>V</span>
        <span>E</span>
        <span>D</span>
        <span>SG</span>
        <span>PTS</span>
      </div>
      ${standings.map((row, index) => `
        <div class="standings-row" role="row">
          <span class="standings-team">
            <strong>${index + 1}</strong>
            <img src="${flagUrl(row.team.code)}" alt="Bandeira: ${row.team.country}" loading="lazy" />
            <span>${row.team.country}</span>
          </span>
          <span>${row.played}</span>
          <span>${row.wins}</span>
          <span>${row.draws}</span>
          <span>${row.losses}</span>
          <span>${row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</span>
          <span><strong>${row.points}</strong></span>
        </div>
      `).join("")}
    </div>
  `;
}

function standingsRankMap(matches) {
  const map = new Map();
  const standings = state.standings?.general || buildStandings(matches);
  standings.forEach((row, index) => {
    map.set(row.team.code, index + 1);
  });
  return map;
}

function sortMatchesByStandings(matches) {
  const ranks = standingsRankMap(matches);
  return [...matches].sort((a, b) => {
    const aRank = Math.min(ranks.get(a.home_team.code) || 999, ranks.get(a.away_team.code) || 999);
    const bRank = Math.min(ranks.get(b.home_team.code) || 999, ranks.get(b.away_team.code) || 999);
    if (aRank !== bRank) return aRank - bRank;
    return a.date.localeCompare(b.date);
  });
}

function teamBlock(team, side) {
  return `
    <div class="score-pro-team ${side === "away" ? "align-right" : ""}">
      <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
      <span>${team.country}</span>
    </div>
  `;
}

function renderCard(match) {
  return `
    <article class="score-pro-card score-result-row">
      <span class="score-pro-meta">
        <span>Grupo ${match.group}</span>
        <span>${formatDate(match.date)}</span>
      </span>
      <span class="score-pro-line">
        ${teamBlock(match.home_team, "home")}
        <strong>${match.home_score} x ${match.away_score}</strong>
        ${teamBlock(match.away_team, "away")}
      </span>
      <span class="score-pro-footer">
        <span>Estadio: ${venueText(match, "stadium")}</span>
        <span>Cidade: ${venueText(match, "city")}</span>
      </span>
    </article>
  `;
}

function renderDetail(match) {
  if (!match) {
    matchDetail.innerHTML = `
      <div class="detail-empty">
        <strong>Selecione uma partida</strong>
        <span>Clique em qualquer card para abrir os detalhes do jogo.</span>
      </div>
    `;
    return;
  }

  const status = statusFor(match);
  match.stadium = venueText(match, "stadium");
  match.city = venueText(match, "city");
  matchDetail.innerHTML = `
    <div class="detail-top">
      <span class="score-status ${statusClass(status)}">${statusLabel(status)}</span>
      <span>${formatDate(match.date)}${match.minute ? ` · ${match.minute}` : ""}</span>
    </div>
    <div class="detail-score">
      ${teamBlock(match.home_team, "home")}
      <strong>${match.home_score} x ${match.away_score}</strong>
      ${teamBlock(match.away_team, "away")}
    </div>
    <div class="detail-venue">
      <strong>Grupo ${match.group}</strong>
      <span>${match.stadium} · ${match.city}</span>
    </div>
    <div class="detail-stats" aria-label="Estatisticas da partida">
      <div><span>Finalizacoes</span><strong>${match.shotsHome} - ${match.shotsAway}</strong></div>
      <div><span>Posse</span><strong>${match.possessionHome}% - ${match.possessionAway}%</strong></div>
    </div>
  `;
}

function render() {
  const visible = finishedMatches(filterMatches());
  document.body.classList.toggle("standings-only", isGroupMode);
  document.body.classList.toggle("general-standings-page", !isGroupMode);
  matchCount.textContent = String(visible.length);
  scoreTitle.textContent = state.group ? `Grupo ${state.group} | Classificacao das selecoes` : "Classificacao Geral da Copa 2026";
  renderStandings(visible);

  if (!visible.length) {
    scoresGrid.innerHTML = `<div class="empty-state">Nenhuma partida encontrada.</div>`;
    return;
  }

  if (isGroupMode) {
    scoresGrid.innerHTML = "";
    return;
  }

  const ordered = sortMatchesByStandings(visible);
  scoresGrid.innerHTML = `
    <div class="score-results-head">
      <strong>Placares das partidas finalizadas</strong>
      <span>Ordenadas pela classificacao geral</span>
    </div>
    ${ordered.map(renderCard).join("")}
  `;
}

async function bootScores() {
  scoresGrid.innerHTML = `<div class="empty-state">Carregando placares...</div>`;
  groupStandings.innerHTML = `<div class="empty-state">Carregando pontuacao...</div>`;
  clearFrozenSnapshots();

  try {
    const response = await fetch(`/api/scores?v=${APP_DATA_VERSION}&fresh=1&t=${Date.now()}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    state.matches = (payload.scores || []).map(enrichMatch);
    state.standings = payload.standings || null;
    state.updatedAt = new Date().toISOString();

    render();
    window.clearTimeout(state.pollTimer);
    state.pollTimer = window.setTimeout(bootScores, POLL_INTERVAL_MS);
  } catch (error) {
    scoresGrid.innerHTML = `<div class="empty-state">Nao foi possivel carregar os placares agora.</div>`;
  }
}

bootScores();

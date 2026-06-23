const scoresGrid = document.querySelector("#scoresGrid");
const matchDetail = document.querySelector("#matchDetail");
const scoreFilters = document.querySelector("#scoreFilters");
const scoreSearch = document.querySelector("#scoreSearch");
const matchCount = document.querySelector("#matchCount");
const groupCount = document.querySelector("#groupCount");
const selectedLabel = document.querySelector("#selectedLabel");
const scoreTitle = document.querySelector("#scoreTitle");
const groupStandings = document.querySelector("#groupStandings");
const initialGroup = new URLSearchParams(window.location.search).get("group") || "";
const isGroupMode = Boolean(initialGroup);

const state = {
  matches: [],
  filter: "all",
  group: initialGroup.toUpperCase(),
  query: "",
  selectedId: "",
};

const filterLabels = {
  all: "Todos",
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
  const query = normalizeText(state.query);
  return state.matches.filter((match) => {
    const byFilter = state.filter === "all";
    const byGroup = !state.group || match.group === state.group;
    const bySearch = !query || searchable(match).includes(query);
    return byFilter && byGroup && bySearch;
  });
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
  const groupLabel = state.group ? `Grupo ${state.group}` : "Todos os grupos";
  const standings = buildStandings(matches);

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
      <small>Pontuacao por selecao</small>
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

function teamBlock(team, side) {
  return `
    <div class="score-pro-team ${side === "away" ? "align-right" : ""}">
      <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
      <span>${team.country}</span>
    </div>
  `;
}

function renderCard(match) {
  const status = statusFor(match);
  const selected = state.selectedId === match.id ? " is-selected" : "";
  return `
    <button class="score-pro-card${selected}" type="button" data-match-id="${match.id}">
      <span class="score-pro-meta">
        <span>Grupo ${match.group}</span>
        <span class="score-status ${statusClass(status)}">${statusLabel(status)}</span>
      </span>
      <span class="score-pro-line">
        ${teamBlock(match.home_team, "home")}
        <strong>${match.home_score} x ${match.away_score}</strong>
        ${teamBlock(match.away_team, "away")}
      </span>
      <span class="score-pro-footer">
        <span>${formatDate(match.date)}</span>
        <span>${match.city}</span>
      </span>
    </button>
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
  const visible = filterMatches();
  const groups = new Set(visible.map((match) => match.group));
  document.body.classList.toggle("standings-only", isGroupMode);
  matchCount.textContent = String(visible.length);
  groupCount.textContent = String(groups.size);
  selectedLabel.textContent = state.group ? "Pontuacao" : filterLabels[state.filter];
  scoreTitle.textContent = state.group ? `Grupo ${state.group} | Classificacao das selecoes` : "Placares da Copa 2026";
  renderStandings(visible);

  if (!visible.length) {
    scoresGrid.innerHTML = `<div class="empty-state">Nenhuma partida encontrada.</div>`;
    renderDetail(null);
    return;
  }

  if (isGroupMode) {
    scoresGrid.innerHTML = "";
    matchDetail.innerHTML = "";
    return;
  }

  if (!visible.some((match) => match.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }

  scoresGrid.innerHTML = visible.map(renderCard).join("");
  renderDetail(visible.find((match) => match.id === state.selectedId));
}

async function bootScores() {
  scoresGrid.innerHTML = `<div class="empty-state">Carregando placares...</div>`;
  groupStandings.innerHTML = `<div class="empty-state">Carregando pontuacao...</div>`;
  renderDetail(null);

  try {
    const response = await fetch("/api/scores?v=20260623-classificacao-grupo");
    const payload = await response.json();
    state.matches = (payload.scores || []).map(enrichMatch);
    render();
  } catch (error) {
    scoresGrid.innerHTML = `<div class="empty-state">Nao foi possivel carregar os placares agora.</div>`;
  }
}

scoreFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  state.group = "";
  window.history.replaceState({}, "", "/scores.html");
  scoreFilters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  render();
});

scoreSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

scoresGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-match-id]");
  if (!card) return;
  state.selectedId = card.dataset.matchId;
  render();
});

bootScores();

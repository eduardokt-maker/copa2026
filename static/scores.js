const scoresGrid = document.querySelector("#scoresGrid");
const matchDetail = document.querySelector("#matchDetail");
const scoreFilters = document.querySelector("#scoreFilters");
const scoreSearch = document.querySelector("#scoreSearch");
const matchCount = document.querySelector("#matchCount");
const groupCount = document.querySelector("#groupCount");
const selectedLabel = document.querySelector("#selectedLabel");

const state = {
  matches: [],
  filter: "all",
  query: "",
  selectedId: "",
  officialTodayIso: "",
  officialDateReady: false,
};

const filterLabels = {
  all: "Todos",
  today: "Hoje",
  live: "Ao vivo",
  finished: "Encerrados",
  next: "Proximos",
};

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function isoFromCloudDate(dateHeader) {
  if (!dateHeader) return "";
  const cloudDate = new Date(dateHeader);
  if (Number.isNaN(cloudDate.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(cloudDate);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function loadOfficialToday() {
  try {
    const response = await fetch("/api/status?v=20260622-cloud-date", { cache: "no-store" });
    state.officialTodayIso = isoFromCloudDate(response.headers.get("Date"));
  } catch (error) {
    state.officialTodayIso = "";
  } finally {
    state.officialDateReady = true;
  }
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
  const totalGoals = Number(match.home_score || 0) + Number(match.away_score || 0);
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
    intensity: totalGoals >= 4 ? "Alta intensidade" : totalGoals >= 2 ? "Jogo equilibrado" : "Partida estudada",
  };
}

function filterMatches() {
  const todayIso = state.officialTodayIso;
  const query = normalizeText(state.query);
  return state.matches.filter((match) => {
    const status = statusFor(match);
    const byFilter =
      state.filter === "all" ||
      (state.filter === "today" && match.date === todayIso) ||
      (state.filter === "live" && status === "live") ||
      (state.filter === "finished" && status === "finished") ||
      (state.filter === "next" && status === "next");
    const bySearch = !query || searchable(match).includes(query);
    return byFilter && bySearch;
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
      <div><span>Leitura</span><strong>${match.intensity}</strong></div>
    </div>
    <div class="detail-note">
      <strong>Modo placar</strong>
      <span>Dados organizados para visualizacao profissional. Quando houver fonte ao vivo, o mesmo painel pode receber atualizacao automatica.</span>
    </div>
  `;
}

function render() {
  const visible = filterMatches();
  const groups = new Set(visible.map((match) => match.group));
  matchCount.textContent = String(visible.length);
  groupCount.textContent = String(groups.size);
  selectedLabel.textContent = filterLabels[state.filter];

  if (!visible.length) {
    const message =
      state.filter === "today"
        ? state.officialTodayIso
          ? `Nenhuma partida encontrada para hoje (${formatDate(state.officialTodayIso)}).`
          : "Nao foi possivel confirmar a data oficial na nuvem agora."
        : "Nenhuma partida encontrada para este filtro.";
    scoresGrid.innerHTML = `<div class="empty-state">${message}</div>`;
    renderDetail(null);
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
  renderDetail(null);

  try {
    await loadOfficialToday();
    const response = await fetch("/api/scores?v=20260622-cloud-date");
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

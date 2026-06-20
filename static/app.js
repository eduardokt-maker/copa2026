const grid = document.querySelector("#teamGrid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#searchInput");
const teamCount = document.querySelector("#teamCount");
const bottomLinks = document.querySelectorAll(".bottom-nav a");
const listSections = document.querySelectorAll("main > section:not(#rosterScreen)");
const rosterScreen = document.querySelector("#rosterScreen");
const rosterFlag = document.querySelector("#rosterFlag");
const rosterTitle = document.querySelector("#rosterTitle");
const rosterSubtitle = document.querySelector("#rosterSubtitle");
const rosterCount = document.querySelector("#rosterCount");
const rosterSource = document.querySelector("#rosterSource");
const rosterList = document.querySelector("#rosterList");
const backToTeams = document.querySelector("#backToTeams");

let teams = [];

function flagUrl(code) {
  return `https://flagcdn.com/w160/${code}.png`;
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderFilters() {
  filters.innerHTML = "";
  filters.classList.add("single-filter");

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Todas";
  button.className = "active";
  button.setAttribute("aria-current", "true");
  filters.appendChild(button);
}

function renderTeams() {
  const query = normalize(searchInput.value.trim());
  const visible = teams.filter((team) => {
    const searchable = normalize(`${team.name} ${team.country} ${team.region} ${team.confederation}`);
    return searchable.includes(query);
  });

  teamCount.textContent = String(visible.length);
  grid.innerHTML = "";

  visible.forEach((team) => {
    const titleLabel = team.titles === 1 ? "titulo" : "titulos";
    const cupLabel = team.appearances === 1 ? "participacao" : "participacoes";
    const card = document.createElement("article");
    card.className = "team-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir elenco de ${team.country}`);
    card.innerHTML = `
      <div class="team-head">
        <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
        <div>
          <h3>${team.country}</h3>
          <p>${team.name}</p>
        </div>
      </div>
      <div class="cup-stats" aria-label="Historico em Copas do Mundo">
        <span>
          <strong>${team.appearances}</strong>
          <small>${cupLabel}</small>
        </span>
        <span>
          <strong>${team.titles}</strong>
          <small>${titleLabel}</small>
        </span>
      </div>
      <div class="team-meta">
        <span class="tag">${team.confederation}</span>
        <span class="tag">${team.region}</span>
        ${team.host ? '<span class="tag host">Pais-sede</span>' : ""}
        ${team.debut ? '<span class="tag debut">Estreante</span>' : ""}
        ${team.champion ? '<span class="tag champion">Atual campea</span>' : ""}
      </div>
    `;
    card.addEventListener("click", () => openRoster(team));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRoster(team);
      }
    });
    grid.appendChild(card);
  });
}

function setListVisible(isVisible) {
  document.body.classList.toggle("roster-open", !isVisible);
  listSections.forEach((section) => {
    section.hidden = !isVisible;
  });
  rosterScreen.hidden = isVisible;
}

function renderRosterMessage(message) {
  rosterList.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "roster-empty";
  empty.textContent = message;
  rosterList.appendChild(empty);
}

function renderRosterPlayers(players) {
  rosterList.innerHTML = "";
  players.forEach((player) => {
    const row = document.createElement("article");
    row.className = "player-row";

    const number = document.createElement("span");
    number.className = "player-number";
    number.textContent = player.number;

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = player.name;
    const club = document.createElement("small");
    club.textContent = player.club;
    info.append(name, club);

    const position = document.createElement("span");
    position.className = "player-position";
    position.textContent = player.position;

    row.append(number, info, position);
    rosterList.appendChild(row);
  });
}

async function openRoster(team) {
  setListVisible(false);
  rosterFlag.src = flagUrl(team.code);
  rosterFlag.alt = `Bandeira: ${team.country}`;
  rosterTitle.textContent = team.country;
  rosterSubtitle.textContent = `${team.name} · jogadores e clubes`;
  rosterCount.textContent = "0";
  renderRosterMessage("Carregando elenco...");
  window.scrollTo({ top: 0, behavior: "auto" });

  try {
    const response = await fetch(`/api/roster?code=${encodeURIComponent(team.code)}`);
    const payload = await response.json();
    rosterSource.href = payload.source || rosterSource.href;
    rosterCount.textContent = String(payload.count || 0);
    if (payload.players?.length) {
      renderRosterPlayers(payload.players);
      return;
    }
    renderRosterMessage("Elenco oficial ainda nao disponivel para esta selecao.");
  } catch (error) {
    rosterCount.textContent = "0";
    renderRosterMessage("Nao foi possivel carregar o elenco agora.");
  }
}

async function boot() {
  const response = await fetch("/api/teams");
  const payload = await response.json();
  teams = payload.teams;
  teamCount.textContent = String(payload.count);
  renderFilters();
  renderTeams();
}

searchInput.addEventListener("input", renderTeams);
backToTeams.addEventListener("click", () => {
  setListVisible(true);
  window.scrollTo({ top: grid.offsetTop - 20, behavior: "auto" });
});
bottomLinks.forEach((link) => {
  link.addEventListener("click", () => {
    bottomLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
boot();

const grid = document.querySelector("#teamGrid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#searchInput");
const teamCount = document.querySelector("#teamCount");
const bottomLinks = document.querySelectorAll(".bottom-nav a");

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
    card.addEventListener("click", () => openTeamPage(team));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openTeamPage(team);
      }
    });
    grid.appendChild(card);
  });
}

function openTeamPage(team) {
  window.location.href = `/team.html?code=${encodeURIComponent(team.code)}`;
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
bottomLinks.forEach((link) => {
  link.addEventListener("click", () => {
    bottomLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
boot();

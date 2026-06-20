const grid = document.querySelector("#teamGrid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#searchInput");
const teamCount = document.querySelector("#teamCount");
const bottomLinks = document.querySelectorAll(".bottom-nav a");

let teams = [];
let activeConfederation = "Todas";

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
  const confederations = ["Todas", ...new Set(teams.map((team) => team.confederation))].sort((a, b) => {
    if (a === "Todas") return -1;
    if (b === "Todas") return 1;
    return a.localeCompare(b);
  });

  filters.innerHTML = "";
  confederations.forEach((confederation) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = confederation;
    button.className = confederation === activeConfederation ? "active" : "";
    button.addEventListener("click", () => {
      activeConfederation = confederation;
      renderFilters();
      renderTeams();
    });
    filters.appendChild(button);
  });
}

function renderTeams() {
  const query = normalize(searchInput.value.trim());
  const visible = teams.filter((team) => {
    const matchesConfederation = activeConfederation === "Todas" || team.confederation === activeConfederation;
    const searchable = normalize(`${team.name} ${team.country} ${team.region} ${team.confederation}`);
    return matchesConfederation && searchable.includes(query);
  });

  teamCount.textContent = String(visible.length);
  grid.innerHTML = "";

  visible.forEach((team) => {
    const card = document.createElement("article");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-head">
        <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
        <div>
          <h3>${team.country}</h3>
          <p>${team.name}</p>
        </div>
      </div>
      <div class="team-meta">
        <span class="tag">${team.confederation}</span>
        <span class="tag">${team.region}</span>
        ${team.host ? '<span class="tag host">Pais-sede</span>' : ""}
        ${team.debut ? '<span class="tag debut">Estreante</span>' : ""}
        ${team.champion ? '<span class="tag champion">Atual campea</span>' : ""}
      </div>
    `;
    grid.appendChild(card);
  });
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

const groupsGrid = document.querySelector("#groupsGrid");
const GROUPS_POLL_INTERVAL_MS = 60000;
let groupsPollTimer = null;

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function renderMessage(message) {
  groupsGrid.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;
  groupsGrid.appendChild(empty);
}

function formatGoalDifference(value) {
  return value > 0 ? `+${value}` : String(value);
}

function renderGroupStandings(group) {
  if (!group.standings?.length) return "";

  return `
    <div class="standings-table group-card-standings" role="table" aria-label="Classificacao atualizada do ${group.name}">
      <div class="standings-row standings-row-head" role="row">
        <span>Sel.</span>
        <span>J</span>
        <span>V</span>
        <span>E</span>
        <span>D</span>
        <span>SG</span>
        <span>PTS</span>
      </div>
      ${group.standings
        .map(
          (row) => `
            <div class="standings-row" role="row">
              <span class="standings-team">
                <strong>${row.position}</strong>
                <img src="${flagUrl(row.team.code)}" alt="Bandeira: ${row.team.country}" loading="lazy" />
                <span>${row.team.country}</span>
              </span>
              <span>${row.played}</span>
              <span>${row.wins}</span>
              <span>${row.draws}</span>
              <span>${row.losses}</span>
              <span>${formatGoalDifference(row.goalDifference)}</span>
              <span><strong>${row.points}</strong></span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderGroups(groups) {
  groupsGrid.innerHTML = "";

  groups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "group-card";
    card.innerHTML = `
      <div class="group-card-head">
        <span>${group.id}</span>
        <div>
          <h2>${group.name}</h2>
          <p>Classificacao atualizada por jogos encerrados</p>
        </div>
      </div>
      <ol class="group-team-list">
        ${group.teams
          .map(
            (team, index) => `
              <li>
                <span class="draw-position">${group.id}${index + 1}</span>
                <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
                <div>
                  <strong>${team.country}</strong>
                  <small>${team.confederation} · ${team.region}</small>
                </div>
              </li>
            `,
          )
          .join("")}
      </ol>
      ${renderGroupStandings(group)}
    `;
    groupsGrid.appendChild(card);
  });
}

async function bootGroups() {
  if (!groupsGrid.children.length) {
    renderMessage("Carregando grupos...");
  }

  try {
  const response = await fetch(`/api/groups?v=20260628-fifa-source-v1&fresh=1&t=${Date.now()}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    if (!payload.groups?.length) {
      renderMessage("Grupos indisponiveis no momento.");
      return;
    }
    renderGroups(payload.groups);
    window.clearTimeout(groupsPollTimer);
    groupsPollTimer = window.setTimeout(bootGroups, GROUPS_POLL_INTERVAL_MS);
  } catch (error) {
    renderMessage("Nao foi possivel carregar os grupos agora.");
  }
}

bootGroups();

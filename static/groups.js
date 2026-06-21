const groupsGrid = document.querySelector("#groupsGrid");

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
          <p>Primeira fase</p>
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
    `;
    groupsGrid.appendChild(card);
  });
}

async function bootGroups() {
  renderMessage("Carregando grupos...");

  try {
    const response = await fetch("/api/groups");
    const payload = await response.json();
    if (!payload.groups?.length) {
      renderMessage("Grupos indisponiveis no momento.");
      return;
    }
    renderGroups(payload.groups);
  } catch (error) {
    renderMessage("Nao foi possivel carregar os grupos agora.");
  }
}

bootGroups();

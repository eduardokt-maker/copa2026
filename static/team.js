const rosterFlag = document.querySelector("#rosterFlag");
const rosterTitle = document.querySelector("#rosterTitle");
const rosterSubtitle = document.querySelector("#rosterSubtitle");
const rosterCount = document.querySelector("#rosterCount");
const rosterSource = document.querySelector("#rosterSource");
const rosterList = document.querySelector("#rosterList");

function flagUrl(code) {
  return `https://flagcdn.com/w160/${code}.png`;
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
    const clubLabel = document.createElement("span");
    clubLabel.className = "player-club-label";
    clubLabel.textContent = "Time de origem";
    club.textContent = player.club;
    info.append(name, clubLabel, club);

    const position = document.createElement("span");
    position.className = "player-position";
    position.textContent = player.position;

    row.append(number, info, position);
    rosterList.appendChild(row);
  });
}

async function bootTeamPage() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    renderRosterMessage("Selecao nao informada.");
    return;
  }

  renderRosterMessage("Carregando elenco...");

  try {
    const response = await fetch(`/api/roster?code=${encodeURIComponent(code)}`);
    const payload = await response.json();
    if (!payload.ok || !payload.team) {
      renderRosterMessage("Selecao nao encontrada.");
      return;
    }

    const team = payload.team;
    document.title = `${team.country} | copa2026`;
    rosterFlag.src = flagUrl(team.code);
    rosterFlag.alt = `Bandeira: ${team.country}`;
    rosterTitle.textContent = team.country;
    rosterSubtitle.textContent = `${team.name} · jogadores e clubes`;
    rosterSource.href = payload.source || rosterSource.href;
    rosterCount.textContent = String(payload.count || 0);

    if (payload.players?.length) {
      renderRosterPlayers(payload.players);
      return;
    }
    renderRosterMessage("Elenco oficial ainda nao disponivel para esta selecao.");
  } catch (error) {
    renderRosterMessage("Nao foi possivel carregar o elenco agora.");
  }
}

bootTeamPage();

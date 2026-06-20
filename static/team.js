const rosterFlag = document.querySelector("#rosterFlag");
const rosterTitle = document.querySelector("#rosterTitle");
const rosterSubtitle = document.querySelector("#rosterSubtitle");
const rosterCount = document.querySelector("#rosterCount");
const rosterSource = document.querySelector("#rosterSource");
const rosterList = document.querySelector("#rosterList");

const positionLabels = {
  GK: "Goleiro · Goalkeeper",
  DF: "Defesa · Defender",
  MF: "Meio-campo · Midfielder",
  FW: "Ataque · Forward",
};

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
    info.className = "player-main";
    const name = document.createElement("strong");
    name.textContent = player.name;
    info.append(name);

    const club = document.createElement("span");
    club.className = "player-club";
    if (player.club_flag) {
      const flag = document.createElement("img");
      flag.src = player.club_flag;
      flag.alt = "";
      flag.loading = "lazy";
      club.appendChild(flag);
    }
    const clubText = document.createElement("span");
    clubText.textContent = player.club_country ? `${player.club} · ${player.club_country}` : player.club;
    club.appendChild(clubText);

    const position = document.createElement("span");
    position.className = "player-position";
    position.textContent = positionLabels[player.position] || player.position;

    row.append(number, info, club, position);
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

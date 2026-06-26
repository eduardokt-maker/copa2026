const worldDiagram = document.querySelector("#worldDiagram");
const worldGroupsList = document.querySelector("#worldGroupsList");
const worldGroupCount = document.querySelector("#worldGroupCount");
const worldMatchCount = document.querySelector("#worldMatchCount");
const worldFinishedCount = document.querySelector("#worldFinishedCount");
const worldUpdatedAt = document.querySelector("#worldUpdatedAt");

const WORLD_POLL_INTERVAL_MS = 60000;
const WORLD_DATA_VERSION = "20260625-world-stadiums";
let worldPollTimer = null;

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = String(value || "").split("-");
  if (!year || !month || !day) return "Data a definir";
  return `${day}/${month}/${year}`;
}

function hasFinalScore(match) {
  return Number.isFinite(Number(match.home_score)) && Number.isFinite(Number(match.away_score));
}

function isFinished(match) {
  return (match.status || "finished") === "finished" && hasFinalScore(match);
}

function scoreText(match) {
  if (!hasFinalScore(match)) return "x";
  return `${match.home_score} x ${match.away_score}`;
}

function groupMatches(matches) {
  return matches.reduce((groups, match) => {
    groups[match.group] = groups[match.group] || [];
    groups[match.group].push(match);
    return groups;
  }, {});
}

function groupLeaders(standings) {
  return Object.entries(standings?.groups || {}).reduce((leaders, [groupId, rows]) => {
    leaders[groupId] = rows?.[0] || null;
    return leaders;
  }, {});
}

function renderDiagram(groupsById, leaders) {
  const groupIds = Object.keys(groupsById).sort();
  const cards = groupIds.map((groupId, index) => {
    const leader = leaders[groupId];
    const finished = groupsById[groupId].filter(isFinished).length;
    const angle = (360 / Math.max(groupIds.length, 1)) * index;

    return `
      <a
        class="world-node"
        href="#world-group-${groupId}"
        style="--angle: ${angle}deg"
        aria-label="Ver jogos do Grupo ${groupId}"
      >
        <span class="world-node-letter">${groupId}</span>
        <span class="world-node-info">
          <strong>Grupo ${groupId}</strong>
          <small>${finished} jogos encerrados</small>
        </span>
        ${
          leader
            ? `<span class="world-node-leader"><img src="${flagUrl(leader.team.code)}" alt="" loading="lazy" />${leader.team.country}</span>`
            : `<span class="world-node-leader">Aguardando</span>`
        }
      </a>
    `;
  });

  worldDiagram.querySelectorAll(".world-node").forEach((node) => node.remove());
  worldDiagram.insertAdjacentHTML("beforeend", cards.join(""));
}

function renderMatch(match) {
  return `
    <article class="world-match">
      <div class="world-match-date">
        <strong>${formatDate(match.date)}</strong>
        <span>${match.city || ""}</span>
      </div>
      <div class="world-match-line">
        <span class="world-team">
          <img src="${flagUrl(match.home_team.code)}" alt="Bandeira: ${match.home_team.country}" loading="lazy" />
          <strong>${match.home_team.country}</strong>
        </span>
        <span class="world-score ${isFinished(match) ? "is-finished" : ""}">${scoreText(match)}</span>
        <span class="world-team world-team-away">
          <img src="${flagUrl(match.away_team.code)}" alt="Bandeira: ${match.away_team.country}" loading="lazy" />
          <strong>${match.away_team.country}</strong>
        </span>
      </div>
      <div class="world-stadium">
        <span>Estadio</span>
        <strong>${match.stadium || "Estadio a definir"}</strong>
        <small>${match.city || "Cidade a definir"}</small>
      </div>
    </article>
  `;
}

function renderGroup(groupId, matches, leaders) {
  const leader = leaders[groupId];
  const ordered = [...matches].sort((a, b) => a.date.localeCompare(b.date));
  return `
    <section class="world-group-card" id="world-group-${groupId}">
      <div class="world-group-card-head">
        <span>${groupId}</span>
        <div>
          <h2>Grupo ${groupId}</h2>
          <p>${leader ? `Lider: ${leader.team.country} com ${leader.points} pts` : "Classificacao em aberto"}</p>
        </div>
      </div>
      <div class="world-match-list">
        ${ordered.map(renderMatch).join("")}
      </div>
    </section>
  `;
}

function renderWorld(payload) {
  const matches = payload.scores || [];
  const groupsById = groupMatches(matches);
  const leaders = groupLeaders(payload.standings);
  const groupIds = Object.keys(groupsById).sort();

  worldGroupCount.textContent = String(groupIds.length);
  worldMatchCount.textContent = String(matches.length);
  worldFinishedCount.textContent = String(matches.filter(isFinished).length);
  worldUpdatedAt.textContent = "Atualizado automaticamente";

  renderDiagram(groupsById, leaders);
  worldGroupsList.innerHTML = groupIds.map((groupId) => renderGroup(groupId, groupsById[groupId], leaders)).join("");
}

function renderMessage(message) {
  worldGroupsList.innerHTML = `<div class="empty-state">${message}</div>`;
  worldUpdatedAt.textContent = message;
}

async function bootWorldChampions() {
  if (!worldGroupsList.children.length) {
    renderMessage("Carregando World Champions...");
  }

  try {
    const response = await fetch(`/api/scores?v=${WORLD_DATA_VERSION}&t=${Date.now()}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    renderWorld(payload);
    window.clearTimeout(worldPollTimer);
    worldPollTimer = window.setTimeout(bootWorldChampions, WORLD_POLL_INTERVAL_MS);
  } catch (error) {
    renderMessage("Nao foi possivel carregar os placares agora.");
  }
}

bootWorldChampions();

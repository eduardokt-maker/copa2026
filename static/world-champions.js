const worldDiagram = document.querySelector("#worldDiagram");
const worldGroupsList = document.querySelector("#worldGroupsList");
const worldGroupCount = document.querySelector("#worldGroupCount");
const worldMatchCount = document.querySelector("#worldMatchCount");
const worldFinishedCount = document.querySelector("#worldFinishedCount");
const worldUpdatedAt = document.querySelector("#worldUpdatedAt");

const WORLD_POLL_INTERVAL_MS = 60000;
const WORLD_DATA_VERSION = "20260628-live-sync-v1";
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

function nextPollIntervalMs(payload) {
  const seconds = Number(payload?.score_source?.live_sync?.interval_seconds);
  if (!Number.isFinite(seconds)) return WORLD_POLL_INTERVAL_MS;
  return Math.min(Math.max(seconds * 1000, 30000), 900000);
}

function venueText(match, field) {
  if (match[field]) return match[field];
  return isFinished(match) ? "Local oficial em atualizacao" : "A definir";
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

function teamRemainingMatches(teamCode, matches) {
  return matches.filter((match) => {
    return !isFinished(match) && (match.home_team.code === teamCode || match.away_team.code === teamCode);
  }).length;
}

function hasClinchedTopTwo(row, rows, matches) {
  if (row.position > 2) return false;
  const finishedCount = matches.filter(isFinished).length;
  if (finishedCount >= 6) return true;

  const teamsThatCanCatch = rows.filter((other) => {
    if (other.team.code === row.team.code) return false;
    const maxPoints = other.points + teamRemainingMatches(other.team.code, matches) * 3;
    return maxPoints >= row.points;
  });

  return teamsThatCanCatch.length <= 1;
}

function thirdPlaceKey(row) {
  return [
    -row.points,
    -row.goalDifference,
    -row.goalsFor,
    row.team.country,
  ];
}

function compareThirdPlace(a, b) {
  const aKey = thirdPlaceKey(a);
  const bKey = thirdPlaceKey(b);
  for (let index = 0; index < aKey.length; index += 1) {
    if (aKey[index] < bKey[index]) return -1;
    if (aKey[index] > bKey[index]) return 1;
  }
  return 0;
}

function qualificationMap(standings, groupsById) {
  const thirdRows = Object.entries(standings?.groups || {})
    .map(([groupId, rows]) => ({ ...rows?.find((row) => row.position === 3), groupId }))
    .filter((row) => row.team)
    .sort(compareThirdPlace);
  const bestThirdCodes = new Set(thirdRows.slice(0, 8).map((row) => row.team.code));

  return Object.entries(standings?.groups || {}).reduce((map, [groupId, rows]) => {
    const matches = groupsById[groupId] || [];
    map[groupId] = rows
      .map((row) => {
        if (hasClinchedTopTwo(row, rows, matches)) {
          return { row, label: row.position === 1 ? "Classificada - lider" : "Classificada - top 2", type: "qualified" };
        }
        if (row.position === 3 && bestThirdCodes.has(row.team.code)) {
          return { row, label: "Em zona dos melhores 3º", type: "third-zone" };
        }
        return null;
      })
      .filter(Boolean);
    return map;
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
      <div class="world-venue">
        <div>
          <span>Estadio</span>
          <strong>${venueText(match, "stadium")}</strong>
        </div>
        <div>
          <span>Cidade / local</span>
          <strong>${venueText(match, "city")}</strong>
        </div>
      </div>
    </article>
  `;
}

function renderQualifiedTeams(groupId, qualifiedByGroup) {
  const teams = qualifiedByGroup[groupId] || [];
  if (!teams.length) {
    return `
      <div class="world-qualified-panel is-empty">
        <span>Mata-mata</span>
        <strong>Aguardando definicao</strong>
        <small>Critério: 2 primeiros + 8 melhores terceiros</small>
      </div>
    `;
  }

  return `
    <div class="world-qualified-panel">
      <span>Mata-mata</span>
      <div class="world-qualified-list">
        ${teams.map(({ row, label, type }) => `
          <div class="world-qualified-team ${type === "third-zone" ? "is-third-zone" : ""}">
            <img src="${flagUrl(row.team.code)}" alt="Bandeira: ${row.team.country}" loading="lazy" />
            <strong>${row.team.country}</strong>
            <small>${label}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGroup(groupId, matches, leaders, qualifiedByGroup) {
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
      ${renderQualifiedTeams(groupId, qualifiedByGroup)}
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
  const qualifiedByGroup = qualificationMap(payload.standings, groupsById);
  const groupIds = Object.keys(groupsById).sort();

  worldGroupCount.textContent = String(groupIds.length);
  worldMatchCount.textContent = String(matches.length);
  worldFinishedCount.textContent = String(matches.filter(isFinished).length);
  worldUpdatedAt.textContent = "Atualizado automaticamente | regra: top 2 + 8 melhores 3º";

  renderDiagram(groupsById, leaders);
  worldGroupsList.innerHTML = groupIds
    .map((groupId) => renderGroup(groupId, groupsById[groupId], leaders, qualifiedByGroup))
    .join("");
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
    const response = await fetch(`/api/scores?v=${WORLD_DATA_VERSION}&fresh=1&t=${Date.now()}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    renderWorld(payload);
    window.clearTimeout(worldPollTimer);
    worldPollTimer = window.setTimeout(bootWorldChampions, nextPollIntervalMs(payload));
  } catch (error) {
    renderMessage("Nao foi possivel carregar os placares agora.");
  }
}

bootWorldChampions();

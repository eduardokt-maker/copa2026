const knockoutBoard = document.querySelector("#knockoutBoard");
const KNOCKOUT_DATA_VERSION = "20260628-full-knockout-sync-v1";
const KNOCKOUT_POLL_INTERVAL_MS = 60000;
let knockoutPollTimer = null;

const roundOf32 = [
  { id: 73, date: "28/06", time: "16:00 BRT", stadium: "Los Angeles Stadium", a: { type: "R", group: "A" }, b: { type: "R", group: "B" } },
  { id: 76, date: "29/06", time: "14:00 BRT", stadium: "Houston Stadium", a: { type: "W", group: "C" }, b: { type: "R", group: "F" } },
  { id: 74, date: "29/06", time: "17:30 BRT", stadium: "Boston Stadium", a: { type: "W", group: "E" }, b: { type: "T", groups: ["A", "B", "C", "D", "F"] } },
  { id: 75, date: "29/06", time: "22:00 BRT", stadium: "Estadio Monterrey", a: { type: "W", group: "F" }, b: { type: "R", group: "C" } },
  { id: 78, date: "30/06", time: "14:00 BRT", stadium: "Dallas Stadium", a: { type: "R", group: "E" }, b: { type: "R", group: "I" } },
  { id: 77, date: "30/06", time: "18:00 BRT", stadium: "New York New Jersey Stadium", a: { type: "W", group: "I" }, b: { type: "T", groups: ["C", "D", "F", "G", "H"] } },
  { id: 79, date: "30/06", time: "22:00 BRT", stadium: "Mexico City Stadium", a: { type: "W", group: "A" }, b: { type: "T", groups: ["C", "E", "F", "H", "I"] } },
  { id: 80, date: "01/07", time: "13:00 BRT", stadium: "Atlanta Stadium", a: { type: "W", group: "L" }, b: { type: "T", groups: ["E", "H", "I", "J", "K"] } },
  { id: 82, date: "01/07", time: "17:00 BRT", stadium: "Seattle Stadium", a: { type: "W", group: "G" }, b: { type: "T", groups: ["A", "E", "H", "I", "J"] } },
  { id: 81, date: "01/07", time: "21:00 BRT", stadium: "San Francisco Bay Area Stadium", a: { type: "W", group: "D" }, b: { type: "T", groups: ["B", "E", "F", "I", "J"] } },
  { id: 84, date: "02/07", time: "16:00 BRT", stadium: "Los Angeles Stadium", a: { type: "W", group: "H" }, b: { type: "R", group: "J" } },
  { id: 83, date: "02/07", time: "20:00 BRT", stadium: "Toronto Stadium", a: { type: "R", group: "K" }, b: { type: "R", group: "L" } },
  { id: 85, date: "03/07", time: "00:00 BRT", stadium: "BC Place Vancouver", a: { type: "W", group: "B" }, b: { type: "T", groups: ["E", "F", "G", "I", "J"] } },
  { id: 88, date: "03/07", time: "15:00 BRT", stadium: "Dallas Stadium", a: { type: "R", group: "D" }, b: { type: "R", group: "G" } },
  { id: 86, date: "03/07", time: "19:00 BRT", stadium: "Miami Stadium", a: { type: "W", group: "J" }, b: { type: "R", group: "H" } },
  { id: 87, date: "03/07", time: "22:30 BRT", stadium: "Kansas City Stadium", a: { type: "W", group: "K" }, b: { type: "T", groups: ["D", "E", "I", "J", "L"] } },
];

function applyOfficialKnockoutFixtures(payload) {
  const fixtures = payload?.knockout_fixtures?.all || payload?.knockout_fixtures?.round_of_32 || [];
  const byId = new Map(fixtures.map((fixture) => [Number(fixture.id), fixture]));
  roundOf32.forEach((match) => {
    const official = byId.get(Number(match.id));
    if (!official) return;
    match.dateIso = official.date || match.dateIso;
    match.time = official.time || match.time;
    match.stadium = official.stadium || match.stadium;
    match.city = official.city || match.city;
    match.venueSource = official.source || payload?.knockout_fixtures?.source?.name || "";
  });
  futureRounds.forEach((round) => {
    round.matches.forEach((match) => {
      const official = byId.get(Number(match.id));
      if (!official) return;
      match.dateIso = official.date || match.dateIso;
      match.time = official.time || match.time;
      match.stadium = official.stadium || match.stadium;
      match.city = official.city || match.city;
      match.venueSource = official.source || payload?.knockout_fixtures?.source?.name || "";
    });
  });
}

const futureRounds = [
  {
    title: "Oitavas",
    period: "04/07 a 07/07",
    matches: [
      { id: 90, a: "Vencedor 73", b: "Vencedor 75" },
      { id: 89, a: "Vencedor 74", b: "Vencedor 77" },
      { id: 91, a: "Vencedor 76", b: "Vencedor 78" },
      { id: 92, a: "Vencedor 79", b: "Vencedor 80" },
      { id: 93, a: "Vencedor 83", b: "Vencedor 84" },
      { id: 94, a: "Vencedor 81", b: "Vencedor 82" },
      { id: 95, a: "Vencedor 86", b: "Vencedor 88" },
      { id: 96, a: "Vencedor 85", b: "Vencedor 87" },
    ],
  },
  {
    title: "Quartas",
    period: "09/07 a 11/07",
    matches: [
      { id: 97, a: "Vencedor 89", b: "Vencedor 90" },
      { id: 98, a: "Vencedor 93", b: "Vencedor 94" },
      { id: 99, a: "Vencedor 91", b: "Vencedor 92" },
      { id: 100, a: "Vencedor 95", b: "Vencedor 96" },
    ],
  },
  {
    title: "Semifinais",
    period: "14/07 e 15/07",
    matches: [
      { id: 101, a: "Vencedor 97", b: "Vencedor 98" },
      { id: 102, a: "Vencedor 99", b: "Vencedor 100" },
    ],
  },
  {
    title: "Finais",
    period: "18/07 e 19/07",
    matches: [
      { id: 103, a: "Perdedor 101", b: "Perdedor 102", label: "3o lugar" },
      { id: 104, a: "Vencedor 101", b: "Vencedor 102", label: "Final" },
    ],
  },
];

const thirdPlaceAssignmentsByQualifiedGroups = {
  "B,D,E,F,I,J,K,L": {
    74: "D",
    77: "F",
    79: "E",
    80: "K",
    81: "B",
    82: "J",
    85: "I",
    87: "L",
  },
};

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function thirdPlaceKey(row) {
  return [-row.points, -row.goalDifference, -row.goalsFor, row.team.country];
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

function bestThirdRows(standings) {
  return Object.entries(standings?.groups || {})
    .map(([groupId, rows]) => ({ ...rows?.find((row) => row.position === 3), groupId }))
    .filter((row) => row.team)
    .sort(compareThirdPlace)
    .slice(0, 8);
}

function qualifiedThirdGroupsKey(bestThird) {
  return bestThird.map((row) => row.groupId).sort().join(",");
}

function assignedThirdGroupForMatch(matchId, bestThird) {
  const assignments = thirdPlaceAssignmentsByQualifiedGroups[qualifiedThirdGroupsKey(bestThird)];
  return assignments?.[Number(matchId)] || "";
}

function slotFallback(slot) {
  if (slot.type === "W") return `1o Grupo ${slot.group}`;
  if (slot.type === "R") return `2o Grupo ${slot.group}`;
  return `Melhor 3o ${slot.groups.join("/")}`;
}

function resolveSlot(slot, standings, bestThird, matchId = 0) {
  if (slot.type === "W" || slot.type === "R") {
    const position = slot.type === "W" ? 1 : 2;
    const row = standings?.groups?.[slot.group]?.find((item) => item.position === position);
    return { label: row?.team?.country || slotFallback(slot), team: row?.team || null, meta: slotFallback(slot) };
  }

  const candidates = bestThird.filter((row) => slot.groups.includes(row.groupId));
  const assignedGroup = assignedThirdGroupForMatch(matchId, bestThird);
  const assigned = candidates.find((row) => row.groupId === assignedGroup);
  if (assigned) {
    return {
      label: assigned.team.country,
      team: assigned.team,
      meta: `3o Grupo ${assigned.groupId}`,
    };
  }
  if (candidates.length === 1) {
    return {
      label: candidates[0].team.country,
      team: candidates[0].team,
      meta: `3o Grupo ${candidates[0].groupId}`,
    };
  }
  if (candidates.length > 1) {
    return {
      label: slotFallback(slot),
      team: null,
      meta: `Possiveis: ${candidates.map((row) => `${row.team.country} (${row.groupId})`).join(", ")}`,
    };
  }
  return { label: slotFallback(slot), team: null, meta: "Aguardando definicao dos melhores terceiros" };
}

function renderTeamSlot(slot) {
  return `
    <div class="knockout-team ${slot.team ? "is-known" : ""}">
      ${slot.team ? `<img src="${flagUrl(slot.team.code)}" alt="Bandeira: ${slot.team.country}" loading="lazy" />` : `<span class="knockout-placeholder"></span>`}
      <div>
        <strong>${slot.label}</strong>
        <small>${slot.meta}</small>
      </div>
    </div>
  `;
}

function formatFixtureDate(dateIso) {
  if (!dateIso) return "";
  const [year, month, day] = dateIso.split("-");
  if (!year || !month || !day) return dateIso;
  return `${day}/${month}`;
}

function renderRoundOf32(standings) {
  const bestThird = bestThirdRows(standings);
  return `
    <section class="knockout-round is-round32">
      <div class="knockout-round-head">
        <span>Primeira fase</span>
        <strong>16 avos de final</strong>
        <small>28/06 a 03/07</small>
      </div>
      <div class="knockout-match-list">
        ${roundOf32.map((match) => {
          const a = resolveSlot(match.a, standings, bestThird, match.id);
          const b = resolveSlot(match.b, standings, bestThird, match.id);
          return `
            <article class="knockout-match">
              <div class="knockout-match-meta">
                <strong>Jogo ${match.id}</strong>
                <span>${match.date} | ${match.time}</span>
                <small>${match.stadium || "Estadio a definir"}</small>
              </div>
              ${renderTeamSlot(a)}
              ${renderTeamSlot(b)}
              ${
                match.id === 76
                  ? `<a class="knockout-album-link" href="/japao-album.html" aria-label="Abrir album de figurinha da selecao japonesa">Album de figurinha</a>`
                  : ""
              }
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderFutureRounds() {
  return futureRounds.map((round) => `
    <section class="knockout-round">
      <div class="knockout-round-head">
        <span>Proxima fase</span>
        <strong>${round.title}</strong>
        <small>${round.period}</small>
      </div>
      <div class="knockout-match-list">
        ${round.matches.map((match) => `
          <article class="knockout-match is-future">
            <div class="knockout-match-meta">
              <strong>${match.label || `Jogo ${match.id}`}</strong>
              <span>${match.time ? `${formatFixtureDate(match.dateIso)} · ${match.time}` : round.period}</span>
            </div>
            ${renderTeamSlot({ label: match.a, meta: "A definir", team: null })}
            ${renderTeamSlot({ label: match.b, meta: "A definir", team: null })}
            <div class="knockout-match-venue">
              <small>${match.stadium || "Estadio a definir"}</small>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function renderBracket(payload) {
  applyOfficialKnockoutFixtures(payload);
  knockoutBoard.innerHTML = `
    ${renderRoundOf32(payload.standings)}
    ${renderFutureRounds()}
  `;
}

function nextPollIntervalMs(payload) {
  const seconds = Number(payload?.score_source?.live_sync?.interval_seconds);
  if (!Number.isFinite(seconds)) return KNOCKOUT_POLL_INTERVAL_MS;
  return Math.min(Math.max(seconds * 1000, 30000), 900000);
}

async function bootKnockout() {
  knockoutBoard.innerHTML = `<div class="empty-state">Carregando calendario do mata-mata...</div>`;
  try {
    const response = await fetch(`/api/scores?v=${KNOCKOUT_DATA_VERSION}&fresh=1&t=${Date.now()}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    renderBracket(payload);
    window.clearTimeout(knockoutPollTimer);
    knockoutPollTimer = window.setTimeout(bootKnockout, nextPollIntervalMs(payload));
  } catch (error) {
    knockoutBoard.innerHTML = `<div class="empty-state">Nao foi possivel carregar o mata-mata agora.</div>`;
  }
}

bootKnockout();

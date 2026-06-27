const calendarGroupList = document.querySelector("#calendarGroupList");
const calendarKnockoutList = document.querySelector("#calendarKnockoutList");
const calendarFinishedCount = document.querySelector("#calendarFinishedCount");
const calendarFutureCount = document.querySelector("#calendarFutureCount");
const calendarTotalCount = document.querySelector("#calendarTotalCount");
const calendarUpdatedAt = document.querySelector("#calendarUpdatedAt");
const calendarFilterButtons = document.querySelectorAll("[data-calendar-filter]");

const CALENDAR_VERSION = "20260627-calendario-desc";
const CALENDAR_POLL_INTERVAL_MS = 60000;

let calendarState = {
  scores: [],
  standings: null,
  filter: "all",
  pollTimer: null,
};

const roundOf32 = [
  { id: 73, date: "2026-06-28", time: "16:00 BRT", phase: "16 avos de final", a: { type: "R", group: "A" }, b: { type: "R", group: "B" } },
  { id: 76, date: "2026-06-29", time: "14:00 BRT", phase: "16 avos de final", a: { type: "W", group: "C" }, b: { type: "R", group: "F" } },
  { id: 74, date: "2026-06-29", time: "17:30 BRT", phase: "16 avos de final", a: { type: "W", group: "E" }, b: { type: "T", groups: ["A", "B", "C", "D", "F"] } },
  { id: 75, date: "2026-06-29", time: "22:00 BRT", phase: "16 avos de final", a: { type: "W", group: "F" }, b: { type: "R", group: "C" } },
  { id: 78, date: "2026-06-30", time: "14:00 BRT", phase: "16 avos de final", a: { type: "R", group: "E" }, b: { type: "R", group: "I" } },
  { id: 77, date: "2026-06-30", time: "18:00 BRT", phase: "16 avos de final", a: { type: "W", group: "I" }, b: { type: "T", groups: ["C", "D", "F", "G", "H"] } },
  { id: 79, date: "2026-06-30", time: "22:00 BRT", phase: "16 avos de final", a: { type: "W", group: "A" }, b: { type: "T", groups: ["C", "E", "F", "H", "I"] } },
  { id: 80, date: "2026-07-01", time: "13:00 BRT", phase: "16 avos de final", a: { type: "W", group: "L" }, b: { type: "T", groups: ["E", "H", "I", "J", "K"] } },
  { id: 82, date: "2026-07-01", time: "17:00 BRT", phase: "16 avos de final", a: { type: "W", group: "G" }, b: { type: "T", groups: ["A", "E", "H", "I", "J"] } },
  { id: 81, date: "2026-07-01", time: "21:00 BRT", phase: "16 avos de final", a: { type: "W", group: "D" }, b: { type: "T", groups: ["B", "E", "F", "I", "J"] } },
  { id: 84, date: "2026-07-02", time: "16:00 BRT", phase: "16 avos de final", a: { type: "W", group: "H" }, b: { type: "R", group: "J" } },
  { id: 83, date: "2026-07-02", time: "20:00 BRT", phase: "16 avos de final", a: { type: "R", group: "K" }, b: { type: "R", group: "L" } },
  { id: 85, date: "2026-07-03", time: "00:00 BRT", phase: "16 avos de final", a: { type: "W", group: "B" }, b: { type: "T", groups: ["E", "F", "G", "I", "J"] } },
  { id: 88, date: "2026-07-03", time: "15:00 BRT", phase: "16 avos de final", a: { type: "R", group: "D" }, b: { type: "R", group: "G" } },
  { id: 86, date: "2026-07-03", time: "19:00 BRT", phase: "16 avos de final", a: { type: "W", group: "J" }, b: { type: "R", group: "H" } },
  { id: 87, date: "2026-07-03", time: "22:30 BRT", phase: "16 avos de final", a: { type: "W", group: "K" }, b: { type: "T", groups: ["D", "E", "I", "J", "L"] } },
];

const futureRounds = [
  { phase: "Oitavas", period: "04/07 a 07/07", matches: [
    { id: 89, a: "Vencedor 73", b: "Vencedor 75" },
    { id: 90, a: "Vencedor 74", b: "Vencedor 77" },
    { id: 91, a: "Vencedor 76", b: "Vencedor 78" },
    { id: 92, a: "Vencedor 79", b: "Vencedor 80" },
    { id: 93, a: "Vencedor 83", b: "Vencedor 84" },
    { id: 94, a: "Vencedor 81", b: "Vencedor 82" },
    { id: 95, a: "Vencedor 86", b: "Vencedor 88" },
    { id: 96, a: "Vencedor 85", b: "Vencedor 87" },
  ] },
  { phase: "Quartas", period: "09/07 a 11/07", matches: [
    { id: 97, a: "Vencedor 89", b: "Vencedor 90" },
    { id: 98, a: "Vencedor 93", b: "Vencedor 94" },
    { id: 99, a: "Vencedor 91", b: "Vencedor 92" },
    { id: 100, a: "Vencedor 95", b: "Vencedor 96" },
  ] },
  { phase: "Semifinais", period: "14/07 e 15/07", matches: [
    { id: 101, a: "Vencedor 97", b: "Vencedor 98" },
    { id: 102, a: "Vencedor 99", b: "Vencedor 100" },
  ] },
  { phase: "Finais", period: "18/07 e 19/07", matches: [
    { id: 103, a: "Perdedor 101", b: "Perdedor 102", label: "3o lugar" },
    { id: 104, a: "Vencedor 101", b: "Vencedor 102", label: "Final" },
  ] },
];

const groupMatchday3Dates = {
  A: "2026-06-24",
  B: "2026-06-24",
  C: "2026-06-24",
  D: "2026-06-25",
  E: "2026-06-25",
  F: "2026-06-25",
  G: "2026-06-26",
  H: "2026-06-26",
  I: "2026-06-26",
  J: "2026-06-27",
  K: "2026-06-27",
  L: "2026-06-27",
};

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = String(value || "").split("-");
  if (!year || !month || !day) return String(value || "Data a definir");
  return `${day}/${month}/${year}`;
}

function dateSortKey(match) {
  if (match.dateSortKey) return match.dateSortKey;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(match.date || ""))) return match.date;

  const dateText = String(match.date || "");
  const dayMonthMatches = [...dateText.matchAll(/(\d{2})\/(\d{2})/g)];
  if (dayMonthMatches.length) {
    const [, day, month] = dayMonthMatches[dayMonthMatches.length - 1];
    return `2026-${month}-${day}`;
  }

  return "0000-00-00";
}

function compareMatchesByDateDesc(a, b) {
  const dateCompare = dateSortKey(b).localeCompare(dateSortKey(a));
  if (dateCompare !== 0) return dateCompare;
  const phaseCompare = String(b.phase || b.group || "").localeCompare(String(a.phase || a.group || ""));
  if (phaseCompare !== 0) return phaseCompare;
  return String(b.id || "").localeCompare(String(a.id || ""));
}

function hasFinalScore(match) {
  return Number.isFinite(Number(match.home_score)) && Number.isFinite(Number(match.away_score));
}

function isFinished(match) {
  return (match.status || "finished") === "finished" && hasFinalScore(match);
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

function slotFallback(slot) {
  if (slot.type === "W") return `1o Grupo ${slot.group}`;
  if (slot.type === "R") return `2o Grupo ${slot.group}`;
  return `Melhor 3o ${slot.groups.join("/")}`;
}

function resolveSlot(slot, standings, bestThird) {
  if (slot.type === "W" || slot.type === "R") {
    const position = slot.type === "W" ? 1 : 2;
    const row = standings?.groups?.[slot.group]?.find((item) => item.position === position);
    return { label: row?.team?.country || slotFallback(slot), team: row?.team || null };
  }

  const candidates = bestThird.filter((row) => slot.groups.includes(row.groupId));
  if (candidates.length === 1) {
    return { label: candidates[0].team.country, team: candidates[0].team };
  }
  return { label: slotFallback(slot), team: null };
}

function shouldShow(match) {
  if (calendarState.filter === "finished") return isFinished(match);
  if (calendarState.filter === "future") return !isFinished(match);
  return true;
}

function renderTeam(team, align = "") {
  if (!team?.code) {
    return `<span class="calendar-team ${align}"><span class="calendar-flag-placeholder"></span><strong>${team?.country || "A definir"}</strong></span>`;
  }
  return `
    <span class="calendar-team ${align}">
      <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
      <strong>${team.country}</strong>
    </span>
  `;
}

function renderCalendarCard(match) {
  const finished = isFinished(match);
  const score = finished ? `${match.home_score} x ${match.away_score}` : "x";
  return `
    <article class="calendar-match ${finished ? "is-finished" : "is-future"}">
      <div class="calendar-match-meta">
        <span>${match.phase || `Grupo ${match.group}`}</span>
        <strong>${match.id ? `Jogo ${match.id}` : `Grupo ${match.group}`}</strong>
        <small>${formatDate(match.date)}${match.time ? ` | ${match.time}` : ""}</small>
      </div>
      <div class="calendar-match-line">
        ${renderTeam(match.home_team || { country: match.homeLabel }, "")}
        <span class="calendar-score">${score}</span>
        ${renderTeam(match.away_team || { country: match.awayLabel }, "is-away")}
      </div>
      <div class="calendar-match-footer">
        <span class="calendar-status">${finished ? "Encerrado" : "A acontecer"}</span>
        <span>Estadio: ${match.stadium || "A definir"}</span>
        <span>Cidade/local: ${match.city || "A definir"}</span>
      </div>
    </article>
  `;
}

function buildKnockoutMatches() {
  const bestThird = bestThirdRows(calendarState.standings);
  const firstRound = roundOf32.map((match) => {
    const a = resolveSlot(match.a, calendarState.standings, bestThird);
    const b = resolveSlot(match.b, calendarState.standings, bestThird);
    return {
      ...match,
      status: "next",
      home_team: a.team,
      away_team: b.team,
      homeLabel: a.label,
      awayLabel: b.label,
      stadium: "A definir",
      city: "A definir",
    };
  });
  const future = futureRounds.flatMap((round) =>
    round.matches.map((match) => ({
      id: match.id,
      phase: match.label || round.phase,
      date: round.period,
      dateSortKey: dateSortKey({ date: round.period }),
      status: "next",
      homeLabel: match.a,
      awayLabel: match.b,
      stadium: "A definir",
      city: "A definir",
    })),
  );
  return [...firstRound, ...future];
}

function matchPairKey(a, b) {
  return [a, b].sort().join("-");
}

function buildGroupFutureMatches() {
  const byGroup = calendarState.scores.reduce((groups, match) => {
    groups[match.group] = groups[match.group] || { teams: new Map(), playedPairs: new Set() };
    groups[match.group].teams.set(match.home_team.code, match.home_team);
    groups[match.group].teams.set(match.away_team.code, match.away_team);
    groups[match.group].playedPairs.add(matchPairKey(match.home_team.code, match.away_team.code));
    return groups;
  }, {});

  return Object.entries(byGroup).flatMap(([group, data]) => {
    const teams = [...data.teams.values()];
    const pending = [];
    for (let homeIndex = 0; homeIndex < teams.length; homeIndex += 1) {
      for (let awayIndex = homeIndex + 1; awayIndex < teams.length; awayIndex += 1) {
        const home = teams[homeIndex];
        const away = teams[awayIndex];
        if (!data.playedPairs.has(matchPairKey(home.code, away.code))) {
          pending.push({
            group,
            phase: `Grupo ${group}`,
            date: groupMatchday3Dates[group] || "Data a definir",
            status: "next",
            home_team: home,
            away_team: away,
            stadium: "A definir",
            city: "A definir",
          });
        }
      }
    }
    return pending;
  });
}

function renderGroupCalendar() {
  const visible = [...calendarState.scores, ...buildGroupFutureMatches()]
    .sort(compareMatchesByDateDesc)
    .filter(shouldShow);
  calendarGroupList.innerHTML = visible.length
    ? visible.map(renderCalendarCard).join("")
    : `<div class="empty-state">Nenhum jogo de grupos para este filtro.</div>`;
}

function renderKnockoutCalendar() {
  const visible = buildKnockoutMatches().sort(compareMatchesByDateDesc).filter(shouldShow);
  calendarKnockoutList.innerHTML = visible.length
    ? visible.map(renderCalendarCard).join("")
    : `<div class="empty-state">Nenhum jogo futuro para este filtro.</div>`;
}

function renderSummary() {
  const allMatches = [...calendarState.scores, ...buildGroupFutureMatches(), ...buildKnockoutMatches()];
  const finished = allMatches.filter(isFinished).length;
  calendarFinishedCount.textContent = String(finished);
  calendarFutureCount.textContent = String(allMatches.length - finished);
  calendarTotalCount.textContent = String(allMatches.length);
}

function renderCalendar(payload) {
  calendarState.scores = payload.scores || [];
  calendarState.standings = payload.standings || null;
  calendarUpdatedAt.textContent = "Atualizado automaticamente com jogos encerrados e classificacao recalculada";
  renderSummary();
  renderGroupCalendar();
  renderKnockoutCalendar();
}

function renderMessage(message) {
  calendarUpdatedAt.textContent = message;
  calendarGroupList.innerHTML = `<div class="empty-state">${message}</div>`;
  calendarKnockoutList.innerHTML = `<div class="empty-state">${message}</div>`;
}

async function bootCalendar() {
  if (!calendarGroupList.children.length) {
    renderMessage("Carregando calendario geral...");
  }
  try {
    const response = await fetch(`/api/scores?v=${CALENDAR_VERSION}&fresh=1&t=${Date.now()}`, {
      cache: "no-store",
    });
    renderCalendar(await response.json());
    window.clearTimeout(calendarState.pollTimer);
    calendarState.pollTimer = window.setTimeout(bootCalendar, CALENDAR_POLL_INTERVAL_MS);
  } catch (error) {
    renderMessage("Nao foi possivel carregar o calendario agora.");
  }
}

calendarFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calendarState.filter = button.dataset.calendarFilter;
    calendarFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderSummary();
    renderGroupCalendar();
    renderKnockoutCalendar();
  });
});

bootCalendar();

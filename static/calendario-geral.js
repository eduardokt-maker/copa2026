const calendarGroupList = document.querySelector("#calendarGroupList");
const calendarKnockoutList = document.querySelector("#calendarKnockoutList");
const calendarFinishedCount = document.querySelector("#calendarFinishedCount");
const calendarFutureCount = document.querySelector("#calendarFutureCount");
const calendarTotalCount = document.querySelector("#calendarTotalCount");
const calendarUpdatedAt = document.querySelector("#calendarUpdatedAt");
const calendarFilterButtons = document.querySelectorAll("[data-calendar-filter]");

const CALENDAR_VERSION = "20260628-knockout-business-rules-v2";
const CALENDAR_POLL_INTERVAL_MS = 60000;
const GROUP_IDS = new Set("ABCDEFGHIJKL".split(""));

let calendarState = {
  scores: [],
  knockoutResults: {},
  standings: null,
  filter: "all",
  pollTimer: null,
};

const roundOf32 = [
  { id: 73, date: "2026-06-28", time: "16:00 BRT", phase: "16 avos de final", stadium: "Los Angeles Stadium", a: { type: "R", group: "A" }, b: { type: "R", group: "B" } },
  { id: 76, date: "2026-06-29", time: "14:00 BRT", phase: "16 avos de final", stadium: "Houston Stadium", a: { type: "W", group: "C" }, b: { type: "R", group: "F" } },
  { id: 74, date: "2026-06-29", time: "17:30 BRT", phase: "16 avos de final", stadium: "Boston Stadium", a: { type: "W", group: "E" }, b: { type: "T", groups: ["A", "B", "C", "D", "F"] } },
  { id: 75, date: "2026-06-29", time: "22:00 BRT", phase: "16 avos de final", stadium: "Estadio Monterrey", a: { type: "W", group: "F" }, b: { type: "R", group: "C" } },
  { id: 78, date: "2026-06-30", time: "14:00 BRT", phase: "16 avos de final", stadium: "Dallas Stadium", a: { type: "R", group: "E" }, b: { type: "R", group: "I" } },
  { id: 77, date: "2026-06-30", time: "18:00 BRT", phase: "16 avos de final", stadium: "New York New Jersey Stadium", a: { type: "W", group: "I" }, b: { type: "T", groups: ["C", "D", "F", "G", "H"] } },
  { id: 79, date: "2026-06-30", time: "22:00 BRT", phase: "16 avos de final", stadium: "Mexico City Stadium", a: { type: "W", group: "A" }, b: { type: "T", groups: ["C", "E", "F", "H", "I"] } },
  { id: 80, date: "2026-07-01", time: "13:00 BRT", phase: "16 avos de final", stadium: "Atlanta Stadium", a: { type: "W", group: "L" }, b: { type: "T", groups: ["E", "H", "I", "J", "K"] } },
  { id: 82, date: "2026-07-01", time: "17:00 BRT", phase: "16 avos de final", stadium: "Seattle Stadium", a: { type: "W", group: "G" }, b: { type: "T", groups: ["A", "E", "H", "I", "J"] } },
  { id: 81, date: "2026-07-01", time: "21:00 BRT", phase: "16 avos de final", stadium: "San Francisco Bay Area Stadium", a: { type: "W", group: "D" }, b: { type: "T", groups: ["B", "E", "F", "I", "J"] } },
  { id: 84, date: "2026-07-02", time: "16:00 BRT", phase: "16 avos de final", stadium: "Los Angeles Stadium", a: { type: "W", group: "H" }, b: { type: "R", group: "J" } },
  { id: 83, date: "2026-07-02", time: "20:00 BRT", phase: "16 avos de final", stadium: "Toronto Stadium", a: { type: "R", group: "K" }, b: { type: "R", group: "L" } },
  { id: 85, date: "2026-07-03", time: "00:00 BRT", phase: "16 avos de final", stadium: "BC Place Vancouver", a: { type: "W", group: "B" }, b: { type: "T", groups: ["E", "F", "G", "I", "J"] } },
  { id: 88, date: "2026-07-03", time: "15:00 BRT", phase: "16 avos de final", stadium: "Dallas Stadium", a: { type: "R", group: "D" }, b: { type: "R", group: "G" } },
  { id: 86, date: "2026-07-03", time: "19:00 BRT", phase: "16 avos de final", stadium: "Miami Stadium", a: { type: "W", group: "J" }, b: { type: "R", group: "H" } },
  { id: 87, date: "2026-07-03", time: "22:30 BRT", phase: "16 avos de final", stadium: "Kansas City Stadium", a: { type: "W", group: "K" }, b: { type: "T", groups: ["D", "E", "I", "J", "L"] } },
];

function applyOfficialKnockoutFixtures(payload) {
  const fixtures = payload?.knockout_fixtures?.all || payload?.knockout_fixtures?.round_of_32 || [];
  const byId = new Map(fixtures.map((fixture) => [Number(fixture.id), fixture]));
  roundOf32.forEach((match) => {
    const official = byId.get(Number(match.id));
    if (!official) return;
    match.date = official.date || match.date;
    match.time = official.time || match.time;
    match.stadium = official.stadium || match.stadium;
    match.city = official.city || match.city;
    match.venueSource = official.source || payload?.knockout_fixtures?.source?.name || "";
  });
  futureRounds.forEach((round) => {
    round.matches.forEach((match) => {
      const official = byId.get(Number(match.id));
      if (!official) return;
      match.date = official.date || match.date;
      match.time = official.time || match.time;
      match.stadium = official.stadium || match.stadium;
      match.city = official.city || match.city;
      match.venueSource = official.source || payload?.knockout_fixtures?.source?.name || "";
    });
  });
}

const futureRounds = [
  { phase: "Oitavas", period: "04/07 a 07/07", matches: [
    { id: 90, a: "Vencedor 73", b: "Vencedor 75" },
    { id: 89, a: "Vencedor 74", b: "Vencedor 77" },
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

const groupFixtureTimesBrt = {
  "gb-eng-pa": {
    time: "17:00 BRT",
    source: "Agenda publicada para 27/06: 4pm ET convertido para Brasilia.",
  },
  "gh-hr": {
    time: "17:00 BRT",
    source: "Agenda publicada para 27/06: 4pm ET convertido para Brasilia.",
  },
  "co-pt": {
    time: "19:30 BRT",
    source: "Agenda publicada para 27/06: 6:30pm ET convertido para Brasilia.",
  },
  "cd-uz": {
    time: "19:30 BRT",
    source: "Agenda publicada para 27/06: 6:30pm ET convertido para Brasilia.",
  },
  "at-dz": {
    time: "22:00 BRT",
    source: "Agenda publicada para 27/06: 9pm ET convertido para Brasilia.",
  },
  "ar-jo": {
    time: "22:00 BRT",
    source: "Agenda publicada para 27/06: 9pm ET convertido para Brasilia.",
  },
};

const groupFixtureStadiums = {
  "au-py": "San Francisco Bay Area Stadium",
  "tr-us": "Los Angeles Stadium",
  "be-nz": "BC Place Vancouver",
  "eg-ir": "Seattle Stadium",
  "cv-sa": "Houston Stadium",
  "es-uy": "Estadio Guadalajara",
  "fr-no": "Boston Stadium",
  "iq-sn": "Toronto Stadium",
  "gb-eng-pa": "New York New Jersey Stadium",
  "gh-hr": "Philadelphia Stadium",
  "co-pt": "Miami Stadium",
  "cd-uz": "Atlanta Stadium",
  "at-dz": "Kansas City Stadium",
  "ar-jo": "Dallas Stadium",
};

const weekdaysPt = ["domingo", "segunda-feira", "terca-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sabado"];

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = String(value || "").split("-");
  if (!year || !month || !day) return String(value || "Data a definir");
  return `${day}/${month}/${year}`;
}

function weekdayNameFromIso(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return weekdaysPt[date.getUTCDay()] || "";
}

function formatDateWithWeekday(value) {
  const dateText = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    const weekday = weekdayNameFromIso(dateText);
    return `${weekday} | ${formatDate(dateText)}`;
  }

  const dayMonthMatches = [...dateText.matchAll(/(\d{2})\/(\d{2})/g)];
  if (dayMonthMatches.length === 1) {
    const [, day, month] = dayMonthMatches[0];
    const isoDate = `2026-${month}-${day}`;
    return `${weekdayNameFromIso(isoDate)} | ${day}/${month}/2026`;
  }
  if (dayMonthMatches.length >= 2) {
    const [, startDay, startMonth] = dayMonthMatches[0];
    const [, endDay, endMonth] = dayMonthMatches[dayMonthMatches.length - 1];
    const startIsoDate = `2026-${startMonth}-${startDay}`;
    const endIsoDate = `2026-${endMonth}-${endDay}`;
    return `${weekdayNameFromIso(startIsoDate)} a ${weekdayNameFromIso(endIsoDate)} | ${dateText}/2026`;
  }

  return dateText || "Data a definir";
}

function timeLabel(match) {
  if (isFinished(match) && !match.time) return "Encerrado";
  return match.time || "Aguardando horario oficial";
}

function timeSourceLabel(match) {
  if (isFinished(match) && !match.time) return "Resultado final registrado";
  if (match.timeSource) return match.timeSource;
  if (match.time) return "Horario de Brasilia";
  return "Horario sera atualizado quando confirmado em fonte oficial";
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

function knockoutPhaseOrder(match) {
  const phase = String(match.phase || "").toLowerCase();
  if (phase.includes("16 avos")) return 1;
  if (phase.includes("oitavas")) return 2;
  if (phase.includes("quartas")) return 3;
  if (phase.includes("semifinais")) return 4;
  if (phase.includes("finais") || phase.includes("final")) return 5;
  return 99;
}

function compareKnockoutMatchesByPhase(a, b) {
  const phaseCompare = knockoutPhaseOrder(a) - knockoutPhaseOrder(b);
  if (phaseCompare !== 0) return phaseCompare;
  const dateCompare = dateSortKey(a).localeCompare(dateSortKey(b));
  if (dateCompare !== 0) return dateCompare;
  return Number(a.id || 0) - Number(b.id || 0);
}

function hasFinalScore(match) {
  return Number.isFinite(Number(match.home_score)) && Number.isFinite(Number(match.away_score));
}

function isFinished(match) {
  return (match.status || "finished") === "finished" && hasFinalScore(match);
}

function isGroupScore(match) {
  return GROUP_IDS.has(String(match.group || ""));
}

function resultForMatch(matchId) {
  return calendarState.knockoutResults?.[String(matchId)] || null;
}

function resultWinnerCode(result) {
  if (!isFinished(result)) return "";
  if (result.winner) return result.winner;
  if (Number(result.home_score) > Number(result.away_score)) return result.home;
  if (Number(result.away_score) > Number(result.home_score)) return result.away;
  if (Number(result.home_penalties) > Number(result.away_penalties)) return result.home;
  if (Number(result.away_penalties) > Number(result.home_penalties)) return result.away;
  return "";
}

function resultLoserCode(result) {
  const winnerCode = resultWinnerCode(result);
  if (!winnerCode) return "";
  return winnerCode === result.home ? result.away : result.home;
}

function teamSlotFromResult(result, code, fallbackLabel) {
  const team = code === result?.home ? result.home_team : code === result?.away ? result.away_team : null;
  return { label: team?.country || fallbackLabel, team };
}

function resolveFutureTeamSlot(label) {
  const dependency = String(label).match(/^(Vencedor|Perdedor) (\d+)$/);
  if (!dependency) return { label, team: null };
  const result = resultForMatch(dependency[2]);
  if (!result) return { label, team: null };
  const code = dependency[1] === "Vencedor" ? resultWinnerCode(result) : resultLoserCode(result);
  if (!code) return { label, team: null };
  return teamSlotFromResult(result, code, label);
}

function scoreLabel(match) {
  if (!hasFinalScore(match)) return "x";
  const regularScore = `${match.home_score} x ${match.away_score}`;
  if (Number.isFinite(Number(match.home_penalties)) && Number.isFinite(Number(match.away_penalties))) {
    return `${regularScore} (${match.home_penalties} x ${match.away_penalties} pen.)`;
  }
  return regularScore;
}

function nextPollIntervalMs(payload) {
  const seconds = Number(payload?.score_source?.live_sync?.interval_seconds);
  if (!Number.isFinite(seconds)) return CALENDAR_POLL_INTERVAL_MS;
  return Math.min(Math.max(seconds * 1000, 30000), 900000);
}

function stadiumLabel(match) {
  if (match.stadium) return match.stadium;
  return isFinished(match) ? "Local oficial em atualizacao" : "Estadio a definir";
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
    return { label: row?.team?.country || slotFallback(slot), team: row?.team || null };
  }

  const candidates = bestThird.filter((row) => slot.groups.includes(row.groupId));
  const assignedGroup = assignedThirdGroupForMatch(matchId, bestThird);
  const assigned = candidates.find((row) => row.groupId === assignedGroup);
  if (assigned) {
    return { label: assigned.team.country, team: assigned.team };
  }
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
  const score = finished ? scoreLabel(match) : "x";
  const timeInfo = timeLabel(match);
  return `
    <article class="calendar-match ${finished ? "is-finished" : "is-future"}">
      <div class="calendar-match-meta">
        <span>${match.phase || `Grupo ${match.group}`}</span>
        <strong>${match.id ? `Jogo ${match.id}` : `Grupo ${match.group}`}</strong>
        <small>${formatDateWithWeekday(match.date)} | ${timeInfo}</small>
      </div>
      <div class="calendar-match-line">
        ${renderTeam(match.home_team || { country: match.homeLabel }, "")}
        <span class="calendar-score">${score}</span>
        ${renderTeam(match.away_team || { country: match.awayLabel }, "is-away")}
      </div>
      <div class="calendar-match-footer">
        <span class="calendar-status">${finished ? "Encerrado" : "A acontecer"}</span>
        <span>${finished && !match.time ? "Partida encerrada" : `Horario: ${timeInfo}`}</span>
        <span>${timeSourceLabel(match)}</span>
        <span>Estadio: ${stadiumLabel(match)}</span>
      </div>
    </article>
  `;
}

function buildKnockoutMatches() {
  const bestThird = bestThirdRows(calendarState.standings);
  const firstRound = roundOf32.map((match) => {
    const result = resultForMatch(match.id);
    const a = result?.home_team ? { label: result.home_team.country, team: result.home_team } : resolveSlot(match.a, calendarState.standings, bestThird, match.id);
    const b = result?.away_team ? { label: result.away_team.country, team: result.away_team } : resolveSlot(match.b, calendarState.standings, bestThird, match.id);
    return {
      ...match,
      ...(result || {}),
      phase: match.phase,
      status: result?.status || "next",
      home_team: a.team,
      away_team: b.team,
      homeLabel: a.label,
      awayLabel: b.label,
      stadium: result?.stadium || match.stadium || "Estadio a definir",
      city: result?.city || match.city || "",
    };
  });
  const future = futureRounds.flatMap((round) =>
    round.matches.map((match) => {
      const result = resultForMatch(match.id);
      const a = result?.home_team ? { label: result.home_team.country, team: result.home_team } : resolveFutureTeamSlot(match.a);
      const b = result?.away_team ? { label: result.away_team.country, team: result.away_team } : resolveFutureTeamSlot(match.b);
      return {
        id: match.id,
        date: match.date || round.period,
        time: match.time || "",
        dateSortKey: dateSortKey({ date: match.date || round.period }),
        ...(result || {}),
        phase: match.label || round.phase,
        status: result?.status || "next",
        home_team: a.team,
        away_team: b.team,
        homeLabel: a.label,
        awayLabel: b.label,
        stadium: result?.stadium || match.stadium || "Estadio a definir",
        city: result?.city || match.city || "",
        venueSource: match.venueSource || "",
      };
    }),
  );
  return [...firstRound, ...future];
}

function matchPairKey(a, b) {
  return [a, b].sort().join("-");
}

function buildGroupFutureMatches() {
  const byGroup = calendarState.scores.filter(isGroupScore).reduce((groups, match) => {
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
          const pairKey = matchPairKey(home.code, away.code);
          const fixtureTime = groupFixtureTimesBrt[pairKey] || {};
          const fixtureStadium = groupFixtureStadiums[pairKey] || "";
          pending.push({
            group,
            phase: `Grupo ${group}`,
            date: groupMatchday3Dates[group] || "Data a definir",
            time: fixtureTime.time || "",
            timeSource: fixtureTime.source || "",
            status: "next",
            home_team: home,
            away_team: away,
            stadium: fixtureStadium || "Estadio a definir",
          });
        }
      }
    }
    return pending;
  });
}

function renderGroupCalendar() {
  const visible = [...calendarState.scores.filter(isGroupScore), ...buildGroupFutureMatches()]
    .sort(compareMatchesByDateDesc)
    .filter(shouldShow);
  calendarGroupList.innerHTML = visible.length
    ? visible.map(renderCalendarCard).join("")
    : `<div class="empty-state">Nenhum jogo de grupos para este filtro.</div>`;
}

function renderKnockoutCalendar() {
  const visible = buildKnockoutMatches().sort(compareKnockoutMatchesByPhase).filter(shouldShow);
  calendarKnockoutList.innerHTML = visible.length
    ? visible.map(renderCalendarCard).join("")
    : `<div class="empty-state">Nenhum jogo futuro para este filtro.</div>`;
}

function renderSummary() {
  const allMatches = [...calendarState.scores.filter(isGroupScore), ...buildGroupFutureMatches(), ...buildKnockoutMatches()];
  const finished = allMatches.filter(isFinished).length;
  calendarFinishedCount.textContent = String(finished);
  calendarFutureCount.textContent = String(allMatches.length - finished);
  calendarTotalCount.textContent = String(allMatches.length);
}

function renderCalendar(payload) {
  applyOfficialKnockoutFixtures(payload);
  calendarState.scores = payload.scores || [];
  calendarState.knockoutResults = payload.knockout_results || {};
  calendarState.standings = payload.standings || null;
  calendarUpdatedAt.textContent =
    "Atualizado automaticamente com jogos encerrados, classificacao recalculada e horarios futuros em Brasilia quando confirmados";
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
    const payload = await response.json();
    renderCalendar(payload);
    window.clearTimeout(calendarState.pollTimer);
    calendarState.pollTimer = window.setTimeout(bootCalendar, nextPollIntervalMs(payload));
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

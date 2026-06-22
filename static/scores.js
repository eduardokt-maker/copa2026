const scoresGrid = document.querySelector("#scoresGrid");
const scoreGroupNav = document.querySelector("#scoreGroupNav");
const scoreCount = document.querySelector("#scoreCount");

function flagUrl(code) {
  return `https://flagcdn.com/w80/${code}.png`;
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function renderScoreMessage(message) {
  scoresGrid.innerHTML = "";
  scoreGroupNav.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;
  scoresGrid.appendChild(empty);
}

function teamMarkup(team, align = "left") {
  return `
    <div class="score-team ${align === "right" ? "score-team-right" : ""}">
      <img src="${flagUrl(team.code)}" alt="Bandeira: ${team.country}" loading="lazy" />
      <span>${team.country}</span>
    </div>
  `;
}

function renderScores(scores) {
  scoreCount.textContent = String(scores.length);
  scoresGrid.innerHTML = "";
  scoreGroupNav.innerHTML = "";

  const groups = scores.reduce((map, score) => {
    if (!map.has(score.group)) {
      map.set(score.group, []);
    }
    map.get(score.group).push(score);
    return map;
  }, new Map());

  groups.forEach((groupScores, groupId) => {
    const link = document.createElement("a");
    link.href = `#grupo-${groupId}`;
    link.innerHTML = `<span>${groupId}</span><strong>${groupScores.length}</strong>`;
    scoreGroupNav.appendChild(link);
  });

  groups.forEach((groupScores, groupId) => {
    const section = document.createElement("article");
    section.className = "score-group-card";
    section.id = `grupo-${groupId}`;
    section.innerHTML = `
      <div class="score-group-head">
        <span>${groupId}</span>
        <div>
          <h2>Grupo ${groupId}</h2>
          <p>${groupScores.length} de 6 jogos finalizados</p>
        </div>
      </div>
      <div class="score-match-list">
        ${groupScores
          .map(
            (match) => `
              <article class="score-match">
                <div class="score-date">${formatDate(match.date)}</div>
                <div class="score-line">
                  ${teamMarkup(match.home_team)}
                  <strong>${match.home_score} x ${match.away_score}</strong>
                  ${teamMarkup(match.away_team, "right")}
                </div>
                <div class="score-venue">
                  <span>${match.stadium}</span>
                  <small>${match.city}</small>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
    scoresGrid.appendChild(section);
  });
}

async function bootScores() {
  renderScoreMessage("Carregando placares...");

  try {
    const response = await fetch("/api/scores?v=20260622-placares-cache");
    const payload = await response.json();
    if (!payload.scores?.length) {
      renderScoreMessage("Nenhum jogo finalizado cadastrado ainda.");
      return;
    }
    renderScores(payload.scores);
  } catch (error) {
    renderScoreMessage("Nao foi possivel carregar os placares agora.");
  }
}

bootScores();

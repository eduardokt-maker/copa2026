const scoresGrid = document.querySelector("#scoresGrid");
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

  const groups = scores.reduce((map, score) => {
    if (!map.has(score.group)) {
      map.set(score.group, []);
    }
    map.get(score.group).push(score);
    return map;
  }, new Map());

  groups.forEach((groupScores, groupId) => {
    const section = document.createElement("article");
    section.className = "score-group-card";
    section.innerHTML = `
      <div class="score-group-head">
        <span>${groupId}</span>
        <div>
          <h2>Grupo ${groupId}</h2>
          <p>${groupScores.length} jogos finalizados</p>
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
    const response = await fetch("/api/scores");
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

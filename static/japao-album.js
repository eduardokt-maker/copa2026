const japanStickerGrid = document.querySelector("#japanStickerGrid");
const japanAlbumShareButton = document.querySelector(".japan-album-share-button");
const playerFeaturePanel = document.querySelector("#playerFeaturePanel");

const japanPlayers = [
  {
    number: 1,
    position: "GK",
    nameJa: "鈴木 彩艶",
    romaji: "Suzuki Zaion",
    leituraPt: "Záion Suzuki",
    photo: "/assets/japan-album/01-1613330.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1613330?gk=0",
  },
  {
    number: 2,
    position: "DF",
    nameJa: "菅原 由勢",
    romaji: "Sugawara Yukinari",
    leituraPt: "Yukinári Sugawara",
    photo: "/assets/japan-album/02-1601781.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1601781?gk=0",
  },
  {
    number: 3,
    position: "DF",
    nameJa: "谷口 彰悟",
    romaji: "Taniguchi Shogo",
    leituraPt: "Shôgo Taniguchi",
    photo: "/assets/japan-album/03-1300969.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1300969?gk=0",
  },
  {
    number: 4,
    position: "DF",
    nameJa: "板倉 滉",
    romaji: "Itakura Ko",
    leituraPt: "Kô Itakura",
    photo: "/assets/japan-album/04-1401622.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1401622?gk=0",
  },
  {
    number: 5,
    position: "DF",
    nameJa: "長友 佑都",
    romaji: "Nagatomo Yuto",
    leituraPt: "Yúto Nagatomo",
    photo: "/assets/japan-album/05-701087.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/701087?gk=0",
  },
  {
    number: 6,
    position: "FW",
    nameJa: "町野 修斗",
    romaji: "Machino Shuto",
    leituraPt: "Shúto Machino",
    photo: "/assets/japan-album/06-1617896.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1617896?gk=0",
  },
  {
    number: 7,
    position: "MF",
    nameJa: "田中 碧",
    romaji: "Tanaka Ao",
    leituraPt: "Áo Tanaka",
    photo: "/assets/japan-album/07-1603854.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1603854?gk=0",
  },
  {
    number: 8,
    position: "MF",
    nameJa: "久保 建英",
    romaji: "Kubo Takefusa",
    leituraPt: "Takefúsa Kubo",
    photo: "/assets/japan-album/08-1601794.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1601794?gk=0",
  },
  {
    number: 9,
    position: "FW",
    nameJa: "後藤 啓介",
    romaji: "Goto Keisuke",
    leituraPt: "Keisúke Goto",
    photo: "/assets/japan-album/09-1638854.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1638854?gk=0",
  },
  {
    number: 10,
    position: "MF",
    nameJa: "堂安 律",
    romaji: "Doan Ritsu",
    leituraPt: "Rítsu Doan",
    photo: "/assets/japan-album/10-1500574.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1500574?gk=0",
  },
  {
    number: 11,
    position: "MF",
    nameJa: "前田 大然",
    romaji: "Maeda Daizen",
    leituraPt: "Dáizen Maeda",
    photo: "/assets/japan-album/11-1600186.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1600186?gk=0",
  },
  {
    number: 12,
    position: "GK",
    nameJa: "大迫 敬介",
    romaji: "Osako Keisuke",
    leituraPt: "Keisúke Osako",
    photo: "/assets/japan-album/12-1600203.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1600203?gk=0",
  },
  {
    number: 13,
    position: "MF",
    nameJa: "中村 敬斗",
    romaji: "Nakamura Keito",
    leituraPt: "Keito Nakamura",
    photo: "/assets/japan-album/13-1601793.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1601793?gk=0",
  },
  {
    number: 14,
    position: "MF",
    nameJa: "伊東 純也",
    romaji: "Ito Junya",
    leituraPt: "Júnya Ito",
    photo: "/assets/japan-album/14-1400652.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1400652?gk=0",
  },
  {
    number: 15,
    position: "MF",
    nameJa: "鎌田 大地",
    romaji: "Kamada Daichi",
    leituraPt: "Dáichi Kamada",
    photo: "/assets/japan-album/15-1500514.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1500514?gk=0",
  },
  {
    number: 16,
    position: "DF",
    nameJa: "渡辺 剛",
    romaji: "Watanabe Tsuyoshi",
    leituraPt: "Tsuyóshi Watanabe",
    photo: "/assets/japan-album/16-1620727.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1620727?gk=0",
  },
  {
    number: 17,
    position: "MF",
    nameJa: "鈴木 唯人",
    romaji: "Suzuki Yuito",
    leituraPt: "Yúito Suzuki",
    photo: "/assets/japan-album/17-1629432.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1629432?gk=0",
  },
  {
    number: 18,
    position: "FW",
    nameJa: "上田 綺世",
    romaji: "Ueda Ayase",
    leituraPt: "Ayáse Ueda",
    photo: "/assets/japan-album/18-1615529.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1615529?gk=0",
  },
  {
    number: 19,
    position: "FW",
    nameJa: "小川 航基",
    romaji: "Ogawa Koki",
    leituraPt: "Kôki Ogawa",
    photo: "/assets/japan-album/19-1600008.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1600008?gk=0",
  },
  {
    number: 20,
    position: "DF",
    nameJa: "瀬古 歩夢",
    romaji: "Seko Ayumu",
    leituraPt: "Ayúmu Seko",
    photo: "/assets/japan-album/20-1601780.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1601780?gk=0",
  },
  {
    number: 21,
    position: "DF",
    nameJa: "伊藤 洋輝",
    romaji: "Ito Hiroki",
    leituraPt: "Híroki Ito",
    photo: "/assets/japan-album/21-1602299.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1602299?gk=0",
  },
  {
    number: 22,
    position: "DF",
    nameJa: "冨安 健洋",
    romaji: "Tomiyasu Takehiro",
    leituraPt: "Takehíro Tomiyasu",
    photo: "/assets/japan-album/22-1501894.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1501894?gk=0",
  },
  {
    number: 23,
    position: "GK",
    nameJa: "早川 友基",
    romaji: "Hayakawa Tomoki",
    leituraPt: "Tomóki Hayakawa",
    photo: "/assets/japan-album/23-1632225.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1632225?gk=0",
  },
  {
    number: 24,
    position: "MF",
    nameJa: "佐野 海舟",
    romaji: "Sano Kaishu",
    leituraPt: "Kaishú Sano",
    photo: "/assets/japan-album/24-1617620.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1617620?gk=0",
  },
  {
    number: 25,
    position: "DF",
    nameJa: "鈴木 淳之介",
    romaji: "Suzuki Junnosuke",
    leituraPt: "Junnosúke Suzuki",
    photo: "/assets/japan-album/25-1636231.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1636231?gk=0",
  },
  {
    number: 26,
    position: "FW",
    nameJa: "塩貝 健人",
    romaji: "Shiogai Kento",
    leituraPt: "Kento Shiogai",
    photo: "/assets/japan-album/26-1643240.jpg",
    source: "https://soccer.yahoo.co.jp/japan/category/men/teams/142/players/1643240?gk=0",
  },
];

const positionLabels = {
  GK: "Goleiro",
  DF: "Defensor",
  MF: "Meio-campo",
  FW: "Atacante",
};

const playerFeatures = {
  1: {
    tag: "Camisa 01 | Goleiro",
    title: "Suzuki Zaion",
    intro: "A principal caracteristica de Suzuki Zaion e a forca fisica combinada com bons reflexos.",
    bullets: [
      "Reflexos rapidos em finalizacoes de curta distancia.",
      "Forca fisica para disputar bolas aereas.",
      "Boa impulsao e grande alcance no gol.",
      "Chute longo para iniciar contra-ataques.",
      "Seguranca em cruzamentos, usando bem o corpo.",
      "Presenca imponente dentro da area.",
    ],
    summary:
      "Resumo: goleiro fisico, agil, forte em bolas aereas e com potencial para atuar em alto nivel internacional.",
  },
  2: {
    tag: "Camisa 02 | Lateral-direito",
    title: "Sugawara Yukinari",
    intro:
      "A principal caracteristica de Sugawara Yukinari e ser um lateral-direito moderno, rapido e muito participativo pela faixa direita.",
    bullets: [
      "Velocidade para atacar o corredor direito e voltar para recompor.",
      "Boa forca nos duelos defensivos e disputa corpo a corpo.",
      "Versatilidade para atuar como lateral, ala ou jogador mais adiantado pelo lado.",
      "Apoio ofensivo constante, criando linhas de passe e amplitude.",
      "Cruzamentos e passes para assistencia como arma importante.",
      "Leitura defensiva para interceptar jogadas e recuperar a bola.",
    ],
    summary:
      "Resumo: lateral rapido, combativo e versatil, forte no apoio ofensivo e util para dar profundidade ao lado direito do Japao.",
  },
  3: {
    tag: "Camisa 03 | Zagueiro",
    title: "Taniguchi Shogo",
    intro:
      "A principal caracteristica de Taniguchi Shogo e a seguranca defensiva aliada a experiencia para organizar a linha de zaga.",
    bullets: [
      "Zagueiro experiente, acostumado a comandar o setor defensivo.",
      "Boa leitura de posicionamento para cobrir espacos e fechar linhas de passe.",
      "Serenidade para defender dentro da area sem se precipitar.",
      "Regularidade em jogos grandes e experiencia internacional pela selecao japonesa.",
      "Capacidade de iniciar jogadas simples a partir da defesa.",
      "Presenca forte em bolas aereas defensivas.",
    ],
    summary:
      "Resumo: defensor maduro, seguro e posicional, importante para dar equilibrio e lideranca a zaga japonesa.",
  },
  4: {
    tag: "Camisa 04 | Zagueiro",
    title: "Itakura Ko",
    intro:
      "A principal caracteristica de Itakura Ko e a versatilidade defensiva, com boa saida de bola e antecipacao nas jogadas.",
    bullets: [
      "Pode atuar como zagueiro central e tambem como volante defensivo.",
      "Boa qualidade tecnica para construir jogadas desde a defesa.",
      "Antecipacao defensiva para cortar passes antes da finalizacao adversaria.",
      "Altura e alcance para competir em bolas aereas.",
      "Passe longo como recurso para acelerar transicoes ofensivas.",
      "Experiencia em ligas europeias de alta intensidade.",
    ],
    summary:
      "Resumo: zagueiro moderno, tecnico e versatil, forte na leitura defensiva e na construcao desde tras.",
  },
  5: {
    tag: "Camisa 05 | Lateral",
    title: "Nagatomo Yuto",
    intro:
      "A principal caracteristica de Nagatomo Yuto e a intensidade competitiva, combinada com enorme experiencia internacional.",
    bullets: [
      "Lateral de muita energia, entrega e disciplina tatica.",
      "Experiencia acumulada em grandes clubes e varias Copas do Mundo.",
      "Pode atuar pelos dois lados da defesa, com boa adaptacao.",
      "Capacidade de apoiar o ataque e recompor rapidamente.",
      "Boa resistencia fisica para repetir corridas durante o jogo.",
      "Lideranca e leitura emocional de partidas decisivas.",
    ],
    summary:
      "Resumo: lateral veterano, intenso e lider, valioso pela experiencia, versatilidade e competitividade.",
  },
  6: {
    tag: "Camisa 06 | Atacante",
    title: "Machino Shuto",
    intro:
      "A principal caracteristica de Machino Shuto e a presenca como centroavante, usando porte fisico e finalizacao para atacar a area.",
    bullets: [
      "Atacante de referencia, com boa estatura para disputar bolas pelo alto.",
      "Movimento dentro da area para aparecer em zonas de finalizacao.",
      "Capacidade de segurar a bola e dar apoio para a chegada dos meias.",
      "Finalizacao objetiva quando recebe em condicao de chute.",
      "Experiencia recente em ligas europeias, enfrentando defesas mais fisicas.",
      "Opcao util para jogos em que o Japao precisa de presenca no comando do ataque.",
    ],
    summary:
      "Resumo: centroavante fisico e de area, importante para finalizar jogadas e servir como ponto de apoio ofensivo.",
  },
  7: {
    tag: "Camisa 07 | Meio-campo",
    title: "Tanaka Ao",
    intro:
      "A principal caracteristica de Tanaka Ao e o equilibrio no meio-campo, conectando defesa e ataque com disciplina e chegada surpresa.",
    bullets: [
      "Meio-campista central com boa leitura de espacos.",
      "Ajuda na recomposicao defensiva e na pressao apos perda da bola.",
      "Tem chegada de segunda linha para finalizar de fora ou dentro da area.",
      "Boa circulacao de passes para manter o ritmo da equipe.",
      "Intensidade para cobrir setores e sustentar o bloco japones.",
      "Jogador confiavel para partidas de alta exigencia tatica.",
    ],
    summary:
      "Resumo: volante/meia equilibrado, intenso e inteligente, forte para organizar o meio e aparecer como elemento surpresa.",
  },
  8: {
    tag: "Camisa 08 | Destaque tecnico",
    title: "Kubo Takefusa",
    intro:
      "A principal caracteristica de Kubo Takefusa e a criatividade tecnica, com drible curto, passe decisivo e capacidade de desequilibrar pelo lado direito.",
    bullets: [
      "Ponta/meia de muita qualidade tecnica e controle de bola.",
      "Drible curto para escapar da marcacao em espacos pequenos.",
      "Passe final e criacao de chances para os atacantes.",
      "Pode partir da direita e entrar por dentro para armar ou finalizar.",
      "Experiencia em alto nivel na Espanha, atuando na Real Sociedad.",
      "Um dos jogadores mais talentosos e criativos da geracao japonesa.",
    ],
    summary:
      "Resumo: jogador estrela do album, criativo, tecnico e decisivo, capaz de mudar o ritmo do jogo com uma jogada individual.",
  },
  9: {
    tag: "Camisa 09 | Atacante",
    title: "Goto Keisuke",
    intro:
      "A principal caracteristica de Goto Keisuke e o potencial como atacante alto, com presenca de area, profundidade e bom jogo aereo.",
    bullets: [
      "Centroavante jovem, alto e com forte presenca fisica.",
      "Bom recurso em bolas aereas e disputas dentro da area.",
      "Busca profundidade para atacar o espaco entre os zagueiros.",
      "Movimento de atacante moderno, saindo da area para participar da jogada.",
      "Finalizacao em crescimento, com passagem produtiva no futebol belga.",
      "Perfil de grande potencial para evoluir no futebol europeu.",
    ],
    summary:
      "Resumo: atacante promissor, alto e agressivo, forte no jogo aereo e com boa leitura para se posicionar na area.",
  },
  10: {
    tag: "Camisa 10 | Meia-atacante",
    title: "Doan Ritsu",
    intro:
      "A principal caracteristica de Doan Ritsu e o corte da direita para o meio, usando o pe esquerdo para finalizar ou criar jogadas.",
    bullets: [
      "Ponta canhoto moderno, perigoso quando parte da direita para dentro.",
      "Chute forte e preciso de media distancia.",
      "Boa conducao em velocidade e drible frontal.",
      "Pode atuar como ala, ponta ou meia-atacante centralizado.",
      "Combina bem em jogadas curtas e tabelas pelo chao.",
      "Experiencia e poder de decisao em jogos importantes pelo Japao.",
    ],
    summary:
      "Resumo: meia-atacante canhoto, criativo e decisivo, forte no chute, no drible curto e na jogada por dentro.",
  },
};

function renderJapanAlbum() {
  japanStickerGrid.innerHTML = japanPlayers
    .map(
      (player) => `
        <article class="japan-sticker-card ${player.number === 8 ? "japan-sticker-card-star" : ""}">
          <div class="japan-sticker-photo">
            <img src="${player.photo}" alt="Foto de rosto: ${player.romaji}" loading="lazy" />
            <span>${String(player.number).padStart(2, "0")}</span>
            ${player.number === 8 ? '<strong class="japan-sticker-star" aria-label="Jogador destaque">★</strong>' : ""}
          </div>
          <div class="japan-sticker-info">
            <span class="japan-sticker-position">${positionLabels[player.position] || player.position}</span>
            <h2>${player.nameJa}</h2>
            <strong>${player.romaji}</strong>
            <p>${player.leituraPt}</p>
          </div>
          <div class="japan-sticker-actions">
            ${
              playerFeatures[player.number]
                ? `<button class="japan-sticker-feature-button" type="button" data-player-feature-open="${player.number}">Caracteristica</button>`
                : ""
            }
            <a href="${player.source}" target="_blank" rel="noreferrer">Fonte JP</a>
          </div>
        </article>
      `,
    )
    .join("");
}

renderJapanAlbum();

const playerFeatureButtons = document.querySelectorAll("[data-player-feature-open]");
const playerFeatureCloseButtons = document.querySelectorAll("[data-player-feature-close]");
let lastPlayerFeatureButton = null;

function openPlayerFeaturePanel(playerNumber, triggerButton) {
  if (!playerFeaturePanel) return;
  const player = japanPlayers.find((item) => item.number === playerNumber);
  const feature = playerFeatures[playerNumber];
  if (!player || !feature) return;

  playerFeaturePanel.querySelector("#playerFeatureTag").textContent = feature.tag;
  playerFeaturePanel.querySelector("#playerFeaturePanelTitle").textContent = feature.title;
  playerFeaturePanel.querySelector("#playerFeatureIntro").textContent = feature.intro;
  playerFeaturePanel.querySelector("#playerFeatureList").innerHTML = feature.bullets
    .map((bullet) => `<li>${bullet}</li>`)
    .join("");
  playerFeaturePanel.querySelector("#playerFeatureSummary").textContent = feature.summary;
  playerFeaturePanel.querySelector("#playerFeatureSource").href = player.source;

  lastPlayerFeatureButton = triggerButton;
  playerFeaturePanel.hidden = false;
  document.body.classList.add("japan-player-feature-panel-open");
  playerFeaturePanel.querySelector(".japan-player-feature-close")?.focus();
}

function closePlayerFeaturePanel() {
  if (!playerFeaturePanel) return;
  playerFeaturePanel.hidden = true;
  document.body.classList.remove("japan-player-feature-panel-open");
  lastPlayerFeatureButton?.focus();
}

playerFeatureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPlayerFeaturePanel(Number(button.dataset.playerFeatureOpen), button);
  });
});
playerFeatureCloseButtons.forEach((button) => button.addEventListener("click", closePlayerFeaturePanel));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !playerFeaturePanel?.hidden) {
    closePlayerFeaturePanel();
  }
});

const JAPAN_ALBUM_SHARE_URL = "https://copa2026-c776.onrender.com/japao-album.html";
const JAPAN_ALBUM_SHARE_TITLE = "Album da Selecao Japonesa | World Cup 2026";
const JAPAN_ALBUM_SHARE_TEXT =
  "Figurinhas da selecao japonesa com fotos, nomes em japones, romaji e numeros de camisa. EKT System World Cup 2026.";

function openJapanAlbumFallbackShare() {
  const message = `${JAPAN_ALBUM_SHARE_URL}\n\n${JAPAN_ALBUM_SHARE_TEXT}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

async function shareJapanAlbum() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: JAPAN_ALBUM_SHARE_TITLE,
        text: JAPAN_ALBUM_SHARE_TEXT,
        url: JAPAN_ALBUM_SHARE_URL,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  openJapanAlbumFallbackShare();
}

japanAlbumShareButton?.addEventListener("click", shareJapanAlbum);

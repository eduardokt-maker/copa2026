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
  11: {
    tag: "Camisa 11 | Atacante",
    title: "Maeda Daizen",
    intro:
      "A principal caracteristica de Maeda Daizen e a intensidade sem a bola, combinando velocidade, pressao alta e muito trabalho defensivo.",
    bullets: [
      "Atacante muito veloz, capaz de atacar espacos em profundidade.",
      "Pressao constante na saida de bola adversaria.",
      "Versatilidade para jogar aberto pela esquerda, pela direita ou centralizado.",
      "Alta resistencia fisica para repetir sprints durante a partida.",
      "Ajuda bastante na recomposicao defensiva do time.",
      "Movimento agressivo para chegar na area e finalizar.",
    ],
    summary:
      "Resumo: atacante de energia altissima, rapido e coletivo, muito util para pressionar, acelerar transicoes e incomodar a defesa adversaria.",
  },
  12: {
    tag: "Camisa 12 | Goleiro",
    title: "Osako Keisuke",
    intro:
      "A principal caracteristica de Osako Keisuke e a regularidade como goleiro de reflexo rapido e bom posicionamento.",
    bullets: [
      "Goleiro seguro em defesas de media e curta distancia.",
      "Boa leitura de posicionamento para reduzir o angulo do atacante.",
      "Experiencia no futebol japones e passagem pela selecao principal.",
      "Agilidade para reagir em bolas desviadas dentro da area.",
      "Comunicacao com a linha defensiva em situacoes de cruzamento.",
      "Perfil confiavel para compor o grupo de goleiros da selecao.",
    ],
    summary:
      "Resumo: goleiro equilibrado, agil e bem posicionado, importante como opcao segura no elenco japones.",
  },
  13: {
    tag: "Camisa 13 | Ponta",
    title: "Nakamura Keito",
    intro:
      "A principal caracteristica de Nakamura Keito e a finalizacao partindo da ponta esquerda, com chute forte e boa chegada a area.",
    bullets: [
      "Ponta esquerda com boa capacidade de cortar para finalizar.",
      "Chute forte e colocado de media distancia.",
      "Movimento agressivo para atacar o segundo pau.",
      "Pode atuar tambem como atacante por dentro.",
      "Boa relacao entre gols e participacao ofensiva pela selecao.",
      "Experiencia no futebol frances, enfrentando marcacao fisica.",
    ],
    summary:
      "Resumo: ponta finalizador, perigoso pelo lado esquerdo e capaz de transformar jogadas individuais em gols.",
  },
  14: {
    tag: "Camisa 14 | Ponta",
    title: "Ito Junya",
    intro:
      "A principal caracteristica de Ito Junya e a velocidade pelo corredor direito, usando arranque e cruzamento para quebrar defesas.",
    bullets: [
      "Ponta de muita velocidade e aceleracao.",
      "Forte no um contra um quando tem campo para correr.",
      "Cruzamentos perigosos para atacantes de area.",
      "Experiencia internacional ampla pela selecao japonesa.",
      "Pode jogar aberto para dar amplitude ao ataque.",
      "Decisivo em transicoes rapidas e contra-ataques.",
    ],
    summary:
      "Resumo: ponta veloz e direto, especialista em atacar o lado direito e criar chances com cruzamentos e arrancadas.",
  },
  15: {
    tag: "Camisa 15 | Meio-campo",
    title: "Kamada Daichi",
    intro:
      "A principal caracteristica de Kamada Daichi e a inteligencia entrelinhas, com passe, tecnica e chegada ofensiva.",
    bullets: [
      "Meio-campista tecnico, capaz de atuar como meia central ou armador.",
      "Boa leitura para receber entre as linhas adversarias.",
      "Passe vertical para acelerar jogadas pelo centro.",
      "Experiencia em ligas fortes da Europa.",
      "Chegada ofensiva para finalizar de media distancia ou dentro da area.",
      "Calma com a bola para organizar ataques em ritmo controlado.",
    ],
    summary:
      "Resumo: meia inteligente e tecnico, forte para conectar setores, criar chances e dar qualidade ao jogo posicional do Japao.",
  },
  16: {
    tag: "Camisa 16 | Zagueiro",
    title: "Watanabe Tsuyoshi",
    intro:
      "A principal caracteristica de Watanabe Tsuyoshi e a imposicao fisica como zagueiro central, com forca em duelos e bolas aereas.",
    bullets: [
      "Zagueiro de boa estatura e presenca fisica.",
      "Forte em disputas aereas defensivas.",
      "Boa experiencia em clubes europeus.",
      "Pode defender em linha alta usando contato e antecipacao.",
      "Oferece seguranca em jogos com cruzamentos constantes.",
      "Mantem perfil simples e objetivo na saida de bola.",
    ],
    summary:
      "Resumo: defensor fisico e dominante no jogo aereo, util para proteger a area e equilibrar duelos contra atacantes fortes.",
  },
  17: {
    tag: "Camisa 17 | Meia-atacante",
    title: "Suzuki Yuito",
    intro:
      "A principal caracteristica de Suzuki Yuito e a mobilidade ofensiva, atuando entre ponta e meia com chegada para finalizar.",
    bullets: [
      "Meia-atacante versatil, podendo jogar por dentro ou aberto.",
      "Boa conducao de bola em espacos curtos.",
      "Movimento para aparecer entre linhas e atacar a area.",
      "Finalizacao em crescimento apos boa passagem pelo futebol europeu.",
      "Capacidade de acelerar jogadas com drible e passe curto.",
      "Perfil jovem, tecnico e dinamico para mudar ritmo no ataque.",
    ],
    summary:
      "Resumo: jogador movel e criativo, forte para entrar entre linhas, conduzir a bola e oferecer alternativas ofensivas.",
  },
  18: {
    tag: "Camisa 18 | Centroavante",
    title: "Ueda Ayase",
    intro:
      "A principal caracteristica de Ueda Ayase e a finalizacao, combinando movimento de atacante, impulsao e presenca de area.",
    bullets: [
      "Centroavante com faro de gol e boa movimentacao dentro da area.",
      "Finalizacao forte com os dois pes.",
      "Boa impulsao e capacidade de atacar cruzamentos.",
      "Agilidade para se desmarcar entre os zagueiros.",
      "Forca para proteger a bola e jogar de costas quando necessario.",
      "Experiencia na Europa, com numeros importantes por clubes e selecao.",
    ],
    summary:
      "Resumo: atacante finalizador, tecnico e agressivo na area, uma das principais referencias de gol do Japao.",
  },
  19: {
    tag: "Camisa 19 | Centroavante",
    title: "Ogawa Koki",
    intro:
      "A principal caracteristica de Ogawa Koki e o instinto de artilheiro, com presenca fisica e boa capacidade de finalizar na area.",
    bullets: [
      "Centroavante alto, forte em disputas dentro da area.",
      "Bom posicionamento para aproveitar rebotes e cruzamentos.",
      "Finalizacao objetiva quando recebe perto do gol.",
      "Historico de gols pela selecao em poucas oportunidades.",
      "Capaz de servir como referencia para bolas diretas.",
      "Experiencia no futebol holandes, com ritmo competitivo europeu.",
    ],
    summary:
      "Resumo: atacante de area, forte fisicamente e oportunista, ideal para transformar volume ofensivo em gols.",
  },
  20: {
    tag: "Camisa 20 | Zagueiro",
    title: "Seko Ayumu",
    intro:
      "A principal caracteristica de Seko Ayumu e a solidez como zagueiro, com boa formacao defensiva e experiencia crescente na Europa.",
    bullets: [
      "Zagueiro central de boa estatura e imposicao.",
      "Formado no Cerezo Osaka, com base defensiva consistente.",
      "Experiencia em ligas europeias, incluindo Suica e Franca.",
      "Boa leitura para defender cruzamentos e bolas longas.",
      "Pode atuar em linha de tres ou dupla de zaga.",
      "Perfil disciplinado para cumprir funcoes taticas.",
    ],
    summary:
      "Resumo: zagueiro confiavel e disciplinado, forte para compor a defesa com jogo simples, fisico e posicional.",
  },
  21: {
    tag: "Camisa 21 | Defensor",
    title: "Ito Hiroki",
    intro:
      "A principal caracteristica de Ito Hiroki e ser um defensor canhoto moderno, capaz de atuar como zagueiro ou lateral-esquerdo.",
    bullets: [
      "Defensor canhoto com boa saida de bola.",
      "Pode jogar como zagueiro pela esquerda ou lateral-esquerdo.",
      "Passe vertical para iniciar ataques desde tras.",
      "Boa leitura para coberturas defensivas pelo lado esquerdo.",
      "Experiencia em clubes de alto nivel na Alemanha.",
      "Importante para dar equilibrio a uma linha defensiva versatil.",
    ],
    summary:
      "Resumo: defensor tecnico, canhoto e versatil, forte para construir desde a defesa e cobrir diferentes posicoes.",
  },
  22: {
    tag: "Camisa 22 | Defensor",
    title: "Tomiyasu Takehiro",
    intro:
      "A principal caracteristica de Tomiyasu Takehiro e a versatilidade defensiva, podendo atuar em praticamente toda a linha de defesa.",
    bullets: [
      "Pode jogar como lateral-direito, lateral-esquerdo ou zagueiro.",
      "Forte fisicamente e seguro em duelos individuais.",
      "Boa leitura de jogo para antecipar e cobrir espacos.",
      "Qualidade tecnica para sair jogando sob pressao.",
      "Experiencia em Premier League, Serie A e selecao japonesa.",
      "Perfil moderno, inteligente e muito confiavel quando fisicamente bem.",
    ],
    summary:
      "Resumo: defensor completo e versatil, forte no duelo, inteligente na leitura e valioso pela capacidade de cobrir varias funcoes.",
  },
  23: {
    tag: "Camisa 23 | Goleiro",
    title: "Hayakawa Tomoki",
    intro:
      "A principal caracteristica de Hayakawa Tomoki e a consistencia, com bom posicionamento e desempenho forte no futebol japones.",
    bullets: [
      "Goleiro seguro, com boa regularidade no Kashima Antlers.",
      "Bom posicionamento para defesas de reflexo e bolas rasteiras.",
      "Capacidade de organizar a defesa em bolas paradas.",
      "Experiencia recente como titular em alto nivel no Japao.",
      "Perfil confiavel para jogos de controle e pouca margem de erro.",
      "Boa concentracao para responder em momentos decisivos.",
    ],
    summary:
      "Resumo: goleiro consistente e bem posicionado, forte pela regularidade e pela seguranca em partidas equilibradas.",
  },
  24: {
    tag: "Camisa 24 | Volante",
    title: "Sano Kaishu",
    intro:
      "A principal caracteristica de Sano Kaishu e a recuperacao de bola, com intensidade defensiva e mobilidade no meio-campo.",
    bullets: [
      "Volante combativo, forte na marcacao e nos duelos.",
      "Boa leitura para interceptar passes no meio.",
      "Mobilidade para cobrir laterais e fechar espacos.",
      "Passe simples para acelerar a transicao depois do desarme.",
      "Experiencia na Bundesliga, em jogo de alta intensidade.",
      "Perfil de equilibrio para proteger a defesa japonesa.",
    ],
    summary:
      "Resumo: volante marcador e intenso, importante para recuperar bolas, proteger a zaga e sustentar o ritmo defensivo.",
  },
  25: {
    tag: "Camisa 25 | Defensor",
    title: "Suzuki Junnosuke",
    intro:
      "A principal caracteristica de Suzuki Junnosuke e a leitura de jogo, com origem como volante e evolucao para zagueiro moderno.",
    bullets: [
      "Pode atuar como zagueiro e volante defensivo.",
      "Boa leitura para antecipar jogadas e conduzir a primeira construcao.",
      "Passe e conducao acima da media para um defensor.",
      "Estatura e imposicao para disputar duelos defensivos.",
      "Perfil jovem, em desenvolvimento no futebol europeu.",
      "Capacidade de defender e participar da organizacao ofensiva.",
    ],
    summary:
      "Resumo: defensor jovem e tecnico, com boa leitura, passe e versatilidade para atuar na zaga ou no meio.",
  },
  26: {
    tag: "Camisa 26 | Atacante",
    title: "Shiogai Kento",
    intro:
      "A principal caracteristica de Shiogai Kento e o potencial ofensivo, com velocidade, presenca de area e faro de gol desde as categorias de base.",
    bullets: [
      "Atacante jovem, rapido e agressivo atacando espacos.",
      "Boa presenca dentro da area para finalizar jogadas.",
      "Historico de destaque em selecoes japonesas de base.",
      "Movimento para receber entre zagueiros e atacar profundidade.",
      "Finalizacao em evolucao no futebol europeu.",
      "Perfil promissor para ganhar minutos e crescer na selecao.",
    ],
    summary:
      "Resumo: atacante jovem e promissor, veloz, vertical e com boa capacidade de chegar para finalizar.",
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

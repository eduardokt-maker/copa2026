const japanStickerGrid = document.querySelector("#japanStickerGrid");

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

function renderJapanAlbum() {
  japanStickerGrid.innerHTML = japanPlayers
    .map(
      (player) => `
        <article class="japan-sticker-card">
          <div class="japan-sticker-photo">
            <img src="${player.photo}" alt="Foto de rosto: ${player.romaji}" loading="lazy" />
            <span>${String(player.number).padStart(2, "0")}</span>
          </div>
          <div class="japan-sticker-info">
            <span class="japan-sticker-position">${positionLabels[player.position] || player.position}</span>
            <h2>${player.nameJa}</h2>
            <strong>${player.romaji}</strong>
            <p>${player.leituraPt}</p>
          </div>
          <div class="japan-sticker-actions">
            <a href="${player.source}" target="_blank" rel="noreferrer">Fonte JP</a>
          </div>
        </article>
      `,
    )
    .join("");
}

renderJapanAlbum();

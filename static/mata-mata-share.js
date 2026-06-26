const knockoutShareButton = document.querySelector(".knockout-share-button");

const KNOCKOUT_SHARE_URL = "https://copa2026-c776.onrender.com/mata-mata-story.html";
const KNOCKOUT_SHARE_TITLE = "Calendario do Mata-mata | World Cup 2026";
const KNOCKOUT_SHARE_TEXT =
  "Brasil x Japao, 16 avos de final e caminho ate a final da World Cup 2026. Desenv. EKT System.";

function openKnockoutFallbackShare() {
  const message = `${KNOCKOUT_SHARE_URL}\n\n${KNOCKOUT_SHARE_TEXT}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

async function shareKnockoutStory() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: KNOCKOUT_SHARE_TITLE,
        text: KNOCKOUT_SHARE_TEXT,
        url: KNOCKOUT_SHARE_URL,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  openKnockoutFallbackShare();
}

knockoutShareButton?.addEventListener("click", shareKnockoutStory);

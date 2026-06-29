const knockoutShareButton = document.querySelector(".knockout-share-button");

const KNOCKOUT_SHARE_URL = "https://copa2026-c776.onrender.com/share/mata-mata";
const KNOCKOUT_SHARE_TEXT = "Caminho ate a final da World Cup 2026. Desenv. EKT";

function openKnockoutFallbackShare() {
  const message = `${KNOCKOUT_SHARE_TEXT} ${KNOCKOUT_SHARE_URL}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

async function shareKnockoutStory() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: KNOCKOUT_SHARE_TEXT,
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

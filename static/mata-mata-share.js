const knockoutShareButton = document.querySelector(".knockout-share-button");

const KNOCKOUT_SHARE_URL = "https://copa2026-c776.onrender.com/share/mata-mata?v=20260629-clickable-card-v1";
const KNOCKOUT_SHARE_TEXT = "Caminho ate a final da World Cup 2026. Desenv. EKT";

function knockoutShareMessage() {
  return `${KNOCKOUT_SHARE_TEXT}\n${KNOCKOUT_SHARE_URL}`;
}

function openKnockoutFallbackShare() {
  window.open(`https://wa.me/?text=${encodeURIComponent(knockoutShareMessage())}`, "_blank", "noopener,noreferrer");
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

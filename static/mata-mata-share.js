const knockoutShareButton = document.querySelector(".knockout-share-button");

const KNOCKOUT_SHARE_URL = "https://copa2026-c776.onrender.com/share/mata-mata";

function openKnockoutFallbackShare() {
  window.open(`https://wa.me/?text=${encodeURIComponent(KNOCKOUT_SHARE_URL)}`, "_blank", "noopener,noreferrer");
}

async function shareKnockoutStory() {
  if (navigator.share) {
    try {
      await navigator.share({
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

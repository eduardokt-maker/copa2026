const knockoutShareButton = document.querySelector(".knockout-share-button");

const KNOCKOUT_SHARE_URL = "https://copa2026-c776.onrender.com/share/mata-mata";
const KNOCKOUT_SHARE_TEXT = "Caminho ate a final da World Cup 2026. Desenv. EKT";
const KNOCKOUT_SHARE_IMAGE_URL = "/mata-mata-share-card.png?v=20260629-share-v3";
const KNOCKOUT_SHARE_IMAGE_NAME = "copa-2026-caminho-ate-a-final.png";

function knockoutShareMessage() {
  return `${KNOCKOUT_SHARE_TEXT}\n${KNOCKOUT_SHARE_URL}`;
}

function openKnockoutFallbackShare() {
  window.open(`https://wa.me/?text=${encodeURIComponent(knockoutShareMessage())}`, "_blank", "noopener,noreferrer");
}

async function buildKnockoutShareFile() {
  const response = await fetch(KNOCKOUT_SHARE_IMAGE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Nao foi possivel carregar a arte de compartilhamento.");

  const blob = await response.blob();
  return new File([blob], KNOCKOUT_SHARE_IMAGE_NAME, { type: blob.type || "image/png" });
}

async function shareKnockoutImageAndLink() {
  if (!navigator.share || !navigator.canShare || typeof File === "undefined") return false;

  const file = await buildKnockoutShareFile();
  const shareData = {
    title: KNOCKOUT_SHARE_TEXT,
    text: knockoutShareMessage(),
    files: [file],
  };

  if (!navigator.canShare(shareData)) return false;

  await navigator.share(shareData);
  return true;
}

async function shareKnockoutStory() {
  if (navigator.share) {
    try {
      if (await shareKnockoutImageAndLink()) return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }

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

const shareButton = document.querySelector(".home-share-button");

const SHARE_URL = "https://copa2026-c776.onrender.com/";
const SHARE_TITLE = "Copa 2026 | EKT System";
const SHARE_TEXT = "Acompanhe grupos, placares e classificacao geral da Copa 2026. Desenv. EKT System.";

function openWhatsAppShare() {
  const message = `${SHARE_TEXT} ${SHARE_URL}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

async function shareHomeLink() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: SHARE_URL,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  openWhatsAppShare();
}

shareButton?.addEventListener("click", shareHomeLink);

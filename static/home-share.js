const shareButton = document.querySelector(".home-share-button");

const SHARE_URL = "https://copa2026-c776.onrender.com/share.html";
const SHARE_TITLE = "World Cup 2026";
const SHARE_TEXT = "World Cup 2026 | Grupos, placares e classificacao geral. Desenv. EKT System.";

function openWhatsAppShare() {
  const message = `${SHARE_URL}\n\n${SHARE_TEXT}`;
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

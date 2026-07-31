import { useEffect, useState } from "react";
import styles from "./ArticleActions.module.css";
import { apiRequest } from "../../services/api.js";

function fingerprint() {
  const key = "dil_like_fp";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `fp_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, value);
  }
  return value;
}

/** Share + like — wired to /api/likes. */
function ArticleActions({ title, slug, contentId, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blogs/${slug}`
      : `/blogs/${slug}`;

  useEffect(() => {
    if (!contentId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const result = await apiRequest(
          `/likes/${contentId}/status?fingerprint=${encodeURIComponent(fingerprint())}`,
          { auth: false }
        );
        if (!cancelled && result.data) {
          setLiked(Boolean(result.data.liked));
          if (typeof result.data.likesCount === "number") {
            setLikes(result.data.likesCount);
          }
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  async function toggleLike() {
    if (!contentId) return;
    try {
      const result = await apiRequest("/likes/toggle", {
        method: "POST",
        body: { contentId, fingerprint: fingerprint() },
        auth: false,
      });
      setLiked(Boolean(result.data?.liked));
      if (typeof result.data?.likesCount === "number") {
        setLikes(result.data.likesCount);
      }
    } catch {
      /* ignore */
    }
  }

  function share(network) {
    const encoded = encodeURIComponent(url);
    const text = encodeURIComponent(title);
    const map = {
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      copy: null,
    };
    if (network === "copy") {
      navigator.clipboard?.writeText(url);
      return;
    }
    window.open(map[network], "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.like} ${liked ? styles.liked : ""}`}
        onClick={toggleLike}
        aria-pressed={liked}
      >
        ♥ {likes}
      </button>
      <div className={styles.share} role="group" aria-label="Share">
        <span className={styles.label}>Share</span>
        <button type="button" onClick={() => share("twitter")}>
          X
        </button>
        <button type="button" onClick={() => share("linkedin")}>
          in
        </button>
        <button type="button" onClick={() => share("copy")}>
          Copy
        </button>
      </div>
    </div>
  );
}

export default ArticleActions;

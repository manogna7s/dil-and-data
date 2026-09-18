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

/** Like control — wired to /api/likes. */
function ArticleActions({ contentId, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

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
    </div>
  );
}

export default ArticleActions;

import { useState } from "react";
import styles from "./ArticleActions.module.css";

/** Share + like — UI only until social/API wiring. */
function ArticleActions({ title, slug }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(24);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/blogs/${slug}`
    : `/blogs/${slug}`;

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
        onClick={() => {
          setLiked((v) => !v);
          setLikes((n) => (liked ? n - 1 : n + 1));
        }}
        aria-pressed={liked}
      >
        ♥ {likes}
      </button>
      <div className={styles.share} role="group" aria-label="Share">
        <span className={styles.label}>Share</span>
        <button type="button" onClick={() => share("twitter")}>X</button>
        <button type="button" onClick={() => share("linkedin")}>in</button>
        <button type="button" onClick={() => share("copy")}>Copy</button>
      </div>
    </div>
  );
}

export default ArticleActions;

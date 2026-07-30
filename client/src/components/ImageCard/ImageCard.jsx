import { Link } from "react-router-dom";
import styles from "./ImageCard.module.css";

/**
 * ImageCard — image with optional caption overlay.
 * Slow zoom on hover for photography sections.
 */
function ImageCard({
  src,
  alt = "",
  caption,
  href,
  aspect = "landscape",
  className = "",
}) {
  const media = (
    <div className={`${styles.frame} ${styles[aspect]}`}>
      <img src={src} alt={alt} className={styles.image} loading="lazy" />
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={`${styles.wrapper} ${className}`}>
        {media}
      </Link>
    );
  }

  return <div className={`${styles.wrapper} ${className}`}>{media}</div>;
}

export default ImageCard;

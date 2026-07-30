import styles from "./PhotographyCard.module.css";

/**
 * PhotographyCard — image-first tile for photo essays.
 * Caption reveals softly on hover like a print margin note.
 */
function PhotographyCard({
  src,
  alt = "",
  title,
  location,
  className = "",
}) {
  return (
    <figure className={`${styles.card} ${className}`}>
      <div className={styles.media}>
        <img src={src} alt={alt || title || ""} className={styles.image} loading="lazy" />
      </div>
      {(title || location) && (
        <figcaption className={styles.caption}>
          {title && <span className={styles.title}>{title}</span>}
          {location && <span className={styles.location}>{location}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export default PhotographyCard;

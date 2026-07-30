import styles from "./Avatar.module.css";

/**
 * Avatar — circular author/portrait image with soft fallback.
 */
function Avatar({ src, alt = "", size = "md", className = "" }) {
  return (
    <span className={`${styles.avatar} ${styles[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {alt ? alt.charAt(0).toUpperCase() : "·"}
        </span>
      )}
    </span>
  );
}

export default Avatar;

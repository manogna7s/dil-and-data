import { optimizeImageUrl } from "../../utils/optimizeImage.js";
import styles from "./PolaroidFrame.module.css";

/**
 * Polaroid-style frame with a soft desi-coded border motif.
 */
function PolaroidFrame({ src, alt = "", caption, floatDelay = 0, className = "" }) {
  if (!src) return null;

  return (
    <figure
      className={`${styles.frame} ${className}`.trim()}
      style={{ animationDelay: `${floatDelay}s` }}
    >
      <div className={styles.motif} aria-hidden="true">
        <span className={styles.cornerTL} />
        <span className={styles.cornerTR} />
        <span className={styles.cornerBL} />
        <span className={styles.cornerBR} />
        <span className={styles.borderTop} />
        <span className={styles.borderBottom} />
      </div>
      <div className={styles.photoWrap}>
        <img
          src={optimizeImageUrl(src, { width: 900 })}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

export default PolaroidFrame;

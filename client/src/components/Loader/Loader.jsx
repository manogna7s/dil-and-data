import LogoMark from "../Logo/LogoMark";
import styles from "./Loader.module.css";

/**
 * Loader — quiet brand mark pulse while content settles.
 */
function Loader({ label = "Loading…", className = "" }) {
  return (
    <div className={`${styles.loader} ${className}`} role="status" aria-live="polite">
      <LogoMark size={40} className={styles.mark} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default Loader;

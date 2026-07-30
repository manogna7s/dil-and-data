import LogoMark from "../../../components/Logo/LogoMark";
import styles from "./StudioLoader.module.css";

function StudioLoader({ label = "Loading…" }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <LogoMark size={36} className={styles.mark} />
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export default StudioLoader;

import styles from "./Divider.module.css";

/** Quiet horizontal rule — chapter break between sections. */
function Divider({ label, className = "" }) {
  if (label) {
    return (
      <div className={`${styles.labeled} ${className}`} role="separator">
        <span className={styles.line} />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} />
      </div>
    );
  }

  return <hr className={`${styles.divider} ${className}`} />;
}

export default Divider;

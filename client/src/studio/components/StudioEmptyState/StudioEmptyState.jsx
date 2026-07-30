import styles from "./StudioEmptyState.module.css";

function StudioEmptyState({
  title = "Nothing here yet",
  description = "When activity arrives, it will settle softly on this page.",
  action,
}) {
  return (
    <div className={styles.empty} role="status">
      <div className={styles.line} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action}
    </div>
  );
}

export default StudioEmptyState;

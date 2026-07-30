import styles from "./EmptyState.module.css";
import Button from "../Button/Button";

/**
 * EmptyState — calm placeholder when a list has no items yet.
 */
function EmptyState({
  title = "Nothing here yet",
  description = "Stories will appear here soon.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`${styles.empty} ${className}`} role="status">
      <div className={styles.ornament} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className={styles.action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

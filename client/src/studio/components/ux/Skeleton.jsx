import styles from "./Skeleton.module.css";

function Skeleton({ lines = 3, className = "" }) {
  return (
    <div className={`${styles.wrap} ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.line}
          style={{ width: `${88 - (i % 3) * 12}%` }}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className={styles.table} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.line} style={{ width: "28%" }} />
          <div className={styles.line} style={{ width: "42%" }} />
          <div className={styles.line} style={{ width: "16%" }} />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

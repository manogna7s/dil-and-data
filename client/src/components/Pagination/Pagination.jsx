import styles from "./Pagination.module.css";
import { IconButton } from "../Button/Button";

/**
 * Pagination — previous / next with quiet page indicators.
 */
function Pagination({
  current = 1,
  total = 1,
  onChange,
  className = "",
}) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className={`${styles.nav} ${className}`} aria-label="Pagination">
      <IconButton
        label="Previous page"
        disabled={current <= 1}
        onClick={() => onChange?.(current - 1)}
      >
        ‹
      </IconButton>

      <ul className={styles.list}>
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={`${styles.page} ${page === current ? styles.active : ""}`}
              aria-current={page === current ? "page" : undefined}
              onClick={() => onChange?.(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <IconButton
        label="Next page"
        disabled={current >= total}
        onClick={() => onChange?.(current + 1)}
      >
        ›
      </IconButton>
    </nav>
  );
}

export default Pagination;

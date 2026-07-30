import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

/**
 * Breadcrumb — quiet path trail for nested pages (e.g. Blogs / Title).
 */
function Breadcrumb({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav className={`${styles.nav} ${className}`} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="link-underline">
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

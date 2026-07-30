import styles from "./Card.module.css";

/**
 * Card — base paper surface. Prefer composition over duplication.
 */
function Card({ children, className = "", as: Tag = "article", hover = true }) {
  return (
    <Tag
      className={`${styles.card} ${hover ? styles.hoverable : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

export default Card;

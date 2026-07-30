import styles from "./Badge.module.css";

/**
 * Badge / Tag / Pill — small editorial labels for categories & status.
 * Shared primitive with visual variants.
 */
function Badge({ children, tone = "accent", className = "" }) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Tag({ children, className = "", ...rest }) {
  return (
    <Badge tone="muted" className={`${styles.tag} ${className}`} {...rest}>
      {children}
    </Badge>
  );
}

export function Pill({ children, className = "", active = false, onClick }) {
  const TagName = onClick ? "button" : "span";
  return (
    <TagName
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`${styles.pill} ${active ? styles.pillActive : ""} ${className}`}
    >
      {children}
    </TagName>
  );
}

export default Badge;

import styles from "./Container.module.css";

/**
 * Container — constrains content to editorial max-widths.
 * size: xs | sm | md | lg | xl
 */
function Container({ children, size = "lg", className = "", as: Tag = "div" }) {
  return (
    <Tag className={`${styles.container} ${styles[size]} ${className}`}>
      {children}
    </Tag>
  );
}

export default Container;

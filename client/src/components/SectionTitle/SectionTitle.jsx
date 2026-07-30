import styles from "./SectionTitle.module.css";

/**
 * SectionTitle — editorial heading with soft highlight underline.
 * Converted from .about-title into a reusable system component.
 * Used on About, Blogs, Categories, Contact, and any chapter heading.
 */
function SectionTitle({
  children,
  as: Tag = "h2",
  align = "left",
  className = "",
}) {
  return (
    <Tag className={`${styles.title} ${styles[align]} ${className}`}>
      <span className={styles.text}>{children}</span>
    </Tag>
  );
}

export default SectionTitle;

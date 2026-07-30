import styles from "./Section.module.css";

/**
 * Section — vertical rhythm wrapper for page blocks.
 * Ensures consistent whitespace between editorial chapters.
 */
function Section({
  children,
  className = "",
  id,
  as: Tag = "section",
  tone = "default",
}) {
  return (
    <Tag id={id} className={`${styles.section} ${styles[tone]} ${className}`}>
      {children}
    </Tag>
  );
}

export default Section;

import styles from "./Section.module.css";

const SECTION_TONES = new Set(["default", "surface", "muted", "white", "blush"]);

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
  const resolved = SECTION_TONES.has(tone) ? tone : "default";
  return (
    <Tag
      id={id}
      className={`${styles.section} ${styles[resolved]} ${className}`}
    >
      {children}
    </Tag>
  );
}

export default Section;

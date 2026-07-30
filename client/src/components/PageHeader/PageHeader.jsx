import Container from "../Container/Container";
import styles from "./PageHeader.module.css";

/**
 * PageHeader — consistent page intro: eyebrow, title, lede.
 * Used at the top of About, Blogs, Categories, Contact.
 */
function PageHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  return (
    <header className={`${styles.header} ${styles[align]} ${className}`}>
      <Container size="md">
        {eyebrow && <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={`lede ${styles.description}`}>{description}</p>}
      </Container>
    </header>
  );
}

export default PageHeader;

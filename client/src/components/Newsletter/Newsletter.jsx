import Container from "../Container/Container";
import NewsletterInput from "../NewsletterInput/NewsletterInput";
import SectionTitle from "../SectionTitle/SectionTitle";
import styles from "./Newsletter.module.css";

/**
 * Newsletter — full-width soft band for email signup.
 * Used in Footer and optionally mid-page on Home.
 */
function Newsletter({
  title = "Stay close to the stories",
  description = "Occasional letters — never noise. Just warm notes from the journal.",
  onSubmit,
  className = "",
}) {
  return (
    <div className={`${styles.band} ${className}`}>
      <Container size="md" className={styles.inner}>
        <SectionTitle align="center" as="h3" className={styles.title}>
          {title}
        </SectionTitle>
        {description && <p className={styles.description}>{description}</p>}
        <NewsletterInput onSubmit={onSubmit} className={styles.form} />
      </Container>
    </div>
  );
}

export default Newsletter;

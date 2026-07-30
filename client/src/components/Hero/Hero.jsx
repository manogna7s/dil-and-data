import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import Container from "../Container/Container";
import styles from "./Hero.module.css";

/**
 * Editorial hero — journal opening feel.
 * Copy is props-driven so a CMS can replace it later.
 */
function Hero({
  eyebrow = "A personal journal",
  title = SITE.NAME,
  tagline = SITE.TAGLINE,
  ctaLabel = "Begin reading",
  ctaTo = ROUTES.BLOGS,
}) {
  return (
    <section className={`${styles.hero} anim-fade-up`} aria-label="Welcome">
      <div className={styles.texture} aria-hidden="true" />
      <Container size="md" className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.actions}>
          <Link to={ctaTo} className={styles.cta}>
            {ctaLabel}
          </Link>
          <Link to={ROUTES.ABOUT} className={`link-underline ${styles.secondary}`}>
            Meet the author
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Hero;

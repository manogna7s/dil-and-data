import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import Container from "../Container/Container";
import BlinkingEyes from "../BlinkingEyes/BlinkingEyes";
import styles from "./Hero.module.css";

/**
 * Editorial hero — journal opening feel.
 * Copy is props-driven so a CMS can replace it later.
 */
function Hero({
  eyebrow = SITE.BLOG_NAME,
  tagline = SITE.TAGLINE,
  ctaLabel = "Enter the journal",
  ctaTo = ROUTES.BLOGS,
}) {
  return (
    <section className={`${styles.hero} anim-fade-up`} aria-label="Welcome">
      <BlinkingEyes />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />
      <Container size="md" className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
        <h1 className={styles.title} aria-label="DIL & DATA">
          <span className={styles.dil}>दिल</span>
          <span className={styles.amp}>&</span>
          <span className={styles.data}>DATA</span>
        </h1>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.actions}>
          <Link to={ctaTo} className={styles.cta}>
            {ctaLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Hero;

import { SITE } from "../../constants";
import styles from "./Footer.module.css";

/**
 * Site footer shell.
 * Links and socials will expand in later phases.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={`brand ${styles.brand}`}>{SITE.NAME}</p>
      <p className={styles.copy}>
        &copy; {year} {SITE.NAME}. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;

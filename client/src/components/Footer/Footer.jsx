import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import { FOOTER_SOCIALS, getCategoriesWithCounts } from "../../data";
import Logo from "../Logo/Logo";
import NewsletterInput from "../NewsletterInput/NewsletterInput";
import SocialIcon from "../SocialIcon/SocialIcon";
import Container from "../Container/Container";
import styles from "./Footer.module.css";

const QUICK_LINKS = [
  { to: ROUTES.HOME, label: "Home" },
  { to: ROUTES.ABOUT, label: "About" },
  { to: ROUTES.BLOGS, label: "Blogs" },
  { to: ROUTES.CONTACT, label: "Contact" },
];

function Footer() {
  const year = new Date().getFullYear();
  const categories = getCategoriesWithCounts().slice(0, 4);

  return (
    <footer className={styles.footer}>
      <Container size="lg">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Logo size={28} />
            <p className={styles.tagline}>{SITE.TAGLINE}</p>
            <div className={styles.socials}>
              {FOOTER_SOCIALS.map((s) => (
                <SocialIcon
                  key={s.id}
                  name={s.id}
                  href={s.href}
                  label={s.label}
                />
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Explore</h4>
            <ul className={styles.list}>
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`link-underline ${styles.link}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Categories</h4>
            <ul className={styles.list}>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.href}
                    className={`link-underline ${styles.link}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.newsletterCol}>
            <h4 className={styles.heading}>Newsletter</h4>
            <p className={styles.newsletterCopy}>
              Soft letters, rarely sent — stories worth keeping.
            </p>
            <NewsletterInput />
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {year} {SITE.NAME}. All rights reserved.
          </p>
          <p className={styles.note}>Written with care · Read slowly</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

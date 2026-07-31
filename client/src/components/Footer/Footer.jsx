import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import { FOOTER_SOCIALS, getCategoriesWithCounts } from "../../data";
import { getSettings } from "../../services/settings.service.js";
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
  const [site, setSite] = useState({
    siteName: SITE.NAME,
    tagline: SITE.TAGLINE,
    footerText: "",
    footerCredit: "Written with care · Read slowly",
    socials: FOOTER_SOCIALS,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSettings();
        if (cancelled || !data) return;
        setSite({
          siteName: data.siteName || SITE.NAME,
          tagline: data.tagline || SITE.TAGLINE,
          footerText: data.footer?.text || "",
          footerCredit: data.footer?.credit || "Written with care · Read slowly",
          socials:
            Array.isArray(data.socials) && data.socials.length
              ? data.socials
              : FOOTER_SOCIALS,
        });
        if (data.favicon) {
          let link = document.querySelector("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.favicon;
        }
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <Container size="lg">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Logo size={28} />
            <p className={styles.tagline}>{site.tagline}</p>
            {site.footerText && <p className={styles.tagline}>{site.footerText}</p>}
            <div className={styles.socials}>
              {site.socials.map((s) => (
                <SocialIcon
                  key={s.id || s.href || s.label}
                  name={s.id || "link"}
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
            &copy; {year} {site.siteName}. All rights reserved.
          </p>
          <p className={styles.note}>{site.footerCredit}</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

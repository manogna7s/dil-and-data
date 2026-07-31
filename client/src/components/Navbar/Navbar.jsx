import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import { IconButton } from "../Button/Button";
import { listNavPages } from "../../services/page.service.js";
import { getSettings } from "../../services/settings.service.js";
import { pagePath } from "../../blocks/blockTypes";
import styles from "./Navbar.module.css";

const CORE_LINKS = [
  { to: ROUTES.BLOGS, label: "Shakti's Blog" },
  { to: ROUTES.CATEGORIES, label: "Categories" },
  { to: ROUTES.CONTACT, label: "Contact" },
];

/**
 * Editorial masthead — brand first, classic journal etiquette.
 */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmsLinks, setCmsLinks] = useState([
    { to: ROUTES.HOME, label: "Home", end: true },
    { to: ROUTES.ABOUT, label: "About" },
  ]);
  const [useCustomNav, setUseCustomNav] = useState(false);
  const [brand, setBrand] = useState({
    siteName: SITE.NAME,
  });

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await getSettings();
        if (!cancelled && settings?.siteName) {
          setBrand({
            siteName: settings.siteName || SITE.NAME,
          });
        }

        const custom = (settings?.navigation || []).filter(
          (item) => item?.enabled !== false && item?.label && item?.href
        );
        if (!cancelled && custom.length) {
          setUseCustomNav(true);
          setCmsLinks(
            custom.map((item) => ({
              to: item.href,
              label: item.label,
              end: item.href === "/",
            }))
          );
          return;
        }

        setUseCustomNav(false);
        const pages = await listNavPages();
        if (cancelled || !Array.isArray(pages) || !pages.length) return;
        setCmsLinks(
          pages.map((page) => ({
            to: pagePath(page.slug),
            label: page.navLabel || page.title,
            end: page.slug === "home",
          }))
        );
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  const links = useCustomNav ? cmsLinks : [...cmsLinks, ...CORE_LINKS];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.masthead}>
        <IconButton
          label={open ? "Close menu" : "Open menu"}
          className={styles.menuToggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}>
            <span />
            <span />
          </span>
        </IconButton>

        <Link to={ROUTES.HOME} className={styles.brand}>
          <span className={styles.siteName}>{brand.siteName}</span>
        </Link>

        {/* Balances the hamburger so the brand stays visually centered */}
        <span className={styles.menuSpacer} aria-hidden="true" />
      </div>

      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav
        id="mobile-menu"
        className={`${styles.mobileNav} ${open ? styles.mobileOpen : ""}`}
        aria-label="Mobile"
      >
        <p className={styles.mobileLabel}>Menu</p>
        {links.map(({ to, label, end }) => (
          <NavLink
            key={`m-${to}-${label}`}
            to={to}
            end={end}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.active : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;

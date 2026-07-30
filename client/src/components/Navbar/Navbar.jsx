import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants";
import Logo from "../Logo/Logo";
import { IconButton } from "../Button/Button";
import { listNavPages } from "../../services/page.service.js";
import { pagePath } from "../../blocks/blockTypes";
import styles from "./Navbar.module.css";

const CORE_LINKS = [
  { to: ROUTES.BLOGS, label: "Blogs" },
  { to: ROUTES.CATEGORIES, label: "Categories" },
  { to: ROUTES.CONTACT, label: "Contact" },
];

/**
 * Navbar — sticky, minimal, editorial.
 * CMS pages with showInNav appear automatically from GET /api/pages/nav.
 */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmsLinks, setCmsLinks] = useState([
    { to: ROUTES.HOME, label: "Home", end: true },
    { to: ROUTES.ABOUT, label: "About" },
  ]);

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
        /* keep fallback Home/About */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  const links = [...cmsLinks, ...CORE_LINKS];

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <Logo size={28} />

        <nav className={styles.desktopNav} aria-label="Main">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

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

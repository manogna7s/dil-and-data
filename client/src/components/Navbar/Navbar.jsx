import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants";
import Logo from "../Logo/Logo";
import { IconButton } from "../Button/Button";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { to: ROUTES.HOME, label: "Home", end: true },
  { to: ROUTES.ABOUT, label: "About" },
  { to: ROUTES.BLOGS, label: "Blogs" },
  { to: ROUTES.CATEGORIES, label: "Categories" },
  { to: ROUTES.CONTACT, label: "Contact" },
];

/**
 * Navbar — sticky, minimal, editorial.
 * Desktop: logo left, links right with growing underlines.
 * Mobile: slide-over menu (book page opening from the right).
 */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <Logo size={28} />

        <nav className={styles.desktopNav} aria-label="Main">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
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
        aria-hidden={!open}
      >
        <p className={styles.mobileLabel}>Menu</p>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.active : ""}`
            }
            onClick={closeMenu}
            tabIndex={open ? 0 : -1}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;

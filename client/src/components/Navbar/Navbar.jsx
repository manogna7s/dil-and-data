import { NavLink } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import styles from "./Navbar.module.css";

/**
 * Site navigation shell.
 * Structure only — visual design comes in a later phase.
 */
function Navbar() {
  return (
    <header className={styles.navbar}>
      <NavLink to={ROUTES.HOME} className={`brand ${styles.logo}`}>
        {SITE.NAME}
      </NavLink>

      <nav className={styles.nav} aria-label="Main">
        <NavLink to={ROUTES.HOME}>Home</NavLink>
        <NavLink to={ROUTES.ABOUT}>About</NavLink>
        <NavLink to={ROUTES.BLOGS}>Blogs</NavLink>
        <NavLink to={ROUTES.CATEGORIES}>Categories</NavLink>
        <NavLink to={ROUTES.CONTACT}>Contact</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;

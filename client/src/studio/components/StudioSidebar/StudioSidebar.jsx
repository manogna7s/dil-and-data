import { NavLink } from "react-router-dom";
import { STUDIO_NAV, SITE } from "../../../constants";
import LogoMark from "../../../components/Logo/LogoMark";
import styles from "./StudioSidebar.module.css";

/**
 * Studio sidebar — calm Notion/Ghost-style navigation.
 */
function StudioSidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
        aria-label="Studio navigation"
      >
        <div className={styles.brand}>
          <LogoMark size={26} />
          <div>
            <p className={styles.brandName}>{SITE.NAME}</p>
            <p className={styles.brandSub}>{SITE.STUDIO_NAME}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {STUDIO_NAV.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className={styles.footerNote}>Write slowly · Publish softly</p>
      </aside>
    </>
  );
}

export default StudioSidebar;

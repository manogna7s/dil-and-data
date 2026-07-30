import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context";
import { STUDIO, ROUTES } from "../../../constants";
import styles from "./StudioTopbar.module.css";

/**
 * Top bar — mobile menu toggle, breadcrumbs slot, profile menu.
 */
function StudioTopbar({ title, breadcrumbs = [], onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function handleLogout() {
    await logout();
    navigate(STUDIO.LOGIN);
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || "M";

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <span />
          <span />
        </button>

        <div>
          {breadcrumbs.length > 0 && (
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => {
                const last = index === breadcrumbs.length - 1;
                return (
                  <span key={`${crumb.label}-${index}`} className={styles.crumb}>
                    {crumb.href && !last ? (
                      <Link to={crumb.href}>{crumb.label}</Link>
                    ) : (
                      <span aria-current={last ? "page" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                    {!last && <span className={styles.sep}>/</span>}
                  </span>
                );
              })}
            </nav>
          )}
          {title && <h1 className={styles.title}>{title}</h1>}
        </div>
      </div>

      <div className={styles.right} ref={menuRef}>
        <Link to={ROUTES.HOME} className={styles.viewSite} target="_blank" rel="noreferrer">
          View site
        </Link>

        <button
          type="button"
          className={styles.avatarBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className={styles.avatar}>{initial}</span>
          <span className={styles.userName}>{user?.name || "Creator"}</span>
        </button>

        {open && (
          <div className={styles.menu} role="menu">
            <div className={styles.menuHeader}>
              <p className={styles.menuName}>{user?.name}</p>
              <p className={styles.menuEmail}>{user?.email}</p>
              <p className={styles.menuRole}>{user?.role}</p>
            </div>
            <Link
              to={STUDIO.SETTINGS}
              className={styles.menuItem}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default StudioTopbar;

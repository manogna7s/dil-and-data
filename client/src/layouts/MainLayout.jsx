import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer, ScrollToTop } from "../components";
import styles from "./MainLayout.module.css";

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}

/**
 * Primary app shell.
 * Shared chrome + scroll utility; pages fill the outlet.
 */
function MainLayout() {
  return (
    <div className={styles.layout}>
      <ScrollToTopOnNavigate />
      <Navbar />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default MainLayout;

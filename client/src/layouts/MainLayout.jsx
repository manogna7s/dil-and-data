import { Outlet } from "react-router-dom";
import { Navbar, Footer, ScrollToTop } from "../components";
import styles from "./MainLayout.module.css";

/**
 * Primary app shell.
 * Shared chrome + scroll utility; pages fill the outlet.
 */
function MainLayout() {
  return (
    <div className={styles.layout}>
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

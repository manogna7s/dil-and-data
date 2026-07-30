import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import styles from "./MainLayout.module.css";

/**
 * Primary app shell.
 * Renders shared chrome once; nested routes fill <Outlet />.
 */
function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

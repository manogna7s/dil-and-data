import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudioSidebar from "../components/StudioSidebar/StudioSidebar";
import StudioTopbar from "../components/StudioTopbar/StudioTopbar";
import {
  StudioChromeProvider,
  useStudioChrome,
} from "../context/StudioChromeContext";
import styles from "./StudioLayout.module.css";

function StudioShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { title, breadcrumbs, wide } = useStudioChrome();

  return (
    <div className={styles.shell}>
      <StudioSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <StudioTopbar
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className={`${styles.content} ${wide ? styles.contentWide : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function StudioLayout() {
  return (
    <StudioChromeProvider>
      <StudioShell />
    </StudioChromeProvider>
  );
}

export default StudioLayout;

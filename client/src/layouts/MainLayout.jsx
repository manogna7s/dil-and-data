import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer, ScrollToTop } from "../components";
import { getSettings } from "../services/settings.service.js";
import styles from "./MainLayout.module.css";

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}

function useSiteChrome() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSettings();
        if (cancelled || !data) return;

        if (data.favicon) {
          let link = document.querySelector("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.favicon;
        }

        const ga = data.analytics?.googleAnalyticsId;
        if (ga && !document.getElementById("dil-ga")) {
          const script = document.createElement("script");
          script.id = "dil-ga";
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
          document.head.appendChild(script);
          const inline = document.createElement("script");
          inline.id = "dil-ga-inline";
          inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`;
          document.head.appendChild(inline);
        }

        const plausible = data.analytics?.plausibleDomain;
        if (plausible && !document.getElementById("dil-plausible")) {
          const script = document.createElement("script");
          script.id = "dil-plausible";
          script.defer = true;
          script.dataset.domain = plausible;
          script.src = "https://plausible.io/js/script.js";
          document.head.appendChild(script);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}

/**
 * Primary app shell.
 * Shared chrome + scroll utility; pages fill the outlet.
 */
function MainLayout() {
  useSiteChrome();

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

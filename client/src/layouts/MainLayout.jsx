import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer, ScrollToTop } from "../components";
import { getSettings } from "../services/settings.service.js";
import useDocumentSeo, { loadSiteSettings } from "../hooks/useDocumentSeo.js";
import { useJsonLd, websiteJsonLd, personJsonLd } from "../utils/jsonLd.js";
import { SITE } from "../constants";
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

function useSiteJsonLd() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadSiteSettings().then((data) => {
      if (!cancelled && data) setSettings(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const base =
    settings?.seoDefaults?.canonicalBase?.replace(/\/$/, "") ||
    SITE.CANONICAL_BASE;
  const name = settings?.siteName || SITE.NAME;
  const description =
    settings?.seoDefaults?.description ||
    settings?.tagline ||
    SITE.TAGLINE;

  useJsonLd(
    "website",
    websiteJsonLd({
      name,
      url: `${base}/`,
      description,
      searchUrl: `${base}/blogs?q={search_term_string}`,
    })
  );

  useJsonLd(
    "person",
    personJsonLd({
      name: SITE.AUTHOR,
      url: `${base}/about`,
      description: settings?.about || undefined,
      image: settings?.logo || undefined,
    })
  );
}

/**
 * Primary app shell.
 * Shared chrome + scroll utility; pages fill the outlet.
 */
function MainLayout() {
  useSiteChrome();
  useDocumentSeo({});
  useSiteJsonLd();

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

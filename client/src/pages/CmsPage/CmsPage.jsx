import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "../../services/page.service.js";
import { readPageCache, writePageCache } from "../../services/pageCache.js";
import { BlockRenderer } from "../../blocks/BlockRenderer";
import { Hero, Loader, EmptyState } from "../../components";
import styles from "./CmsPage.module.css";

const RETRY_WAIT_MS = [0, 400, 1200, 2800];

/**
 * Public CMS page — cached first paint, then refresh from the API.
 */
function CmsPage({ slug: slugProp, preview = false }) {
  const params = useParams();
  const slug = slugProp || params.slug || "home";
  const cached = preview ? null : readPageCache(slug);
  const [page, setPage] = useState(cached);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!cached);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fromCache = preview ? null : readPageCache(slug);

    if (fromCache) {
      setPage(fromCache);
      setLoading(false);
      setError("");
    } else {
      setLoading(true);
    }

    (async () => {
      let lastError = null;
      for (let attempt = 0; attempt < RETRY_WAIT_MS.length; attempt += 1) {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, RETRY_WAIT_MS[attempt]));
        }
        try {
          const data = await getPageBySlug(slug, { preview });
          if (cancelled) return;
          setPage(data);
          setError("");
          setLoading(false);
          if (!preview && data) writePageCache(slug, data);
          return;
        } catch (err) {
          lastError = err;
        }
      }
      if (cancelled) return;
      if (!fromCache) {
        setPage(null);
        setError(
          lastError?.message ||
            "Could not load this page. The API may be waking up — try again."
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, preview, reloadToken]);

  useEffect(() => {
    if (!page) return;
    const title = page.seo?.title || page.title;
    if (title) document.title = `${title} · DIL & DATA`;
    const desc = page.seo?.description;
    if (desc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = desc;
    }
  }, [page]);

  if (page) {
    return (
      <div className={`${styles.page} ${slug === "about" ? styles.aboutPage : ""}`}>
        <BlockRenderer blocks={page.blocks || []} preview={preview} />
      </div>
    );
  }

  if (loading) {
    if (slug === "home") {
      return (
        <div className={styles.page}>
          <Hero />
        </div>
      );
    }
    return (
      <div className={styles.state}>
        <Loader label="Opening the page…" />
      </div>
    );
  }

  return (
    <div className={styles.state}>
      <EmptyState
        title={slug === "home" ? "Home is waking up" : "Page not found"}
        description={
          error ||
          "This page has not been published yet. If you just opened the site, wait a moment and retry."
        }
        actionLabel="Try again"
        onAction={() => setReloadToken((n) => n + 1)}
      />
    </div>
  );
}

export default CmsPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "../../services/page.service.js";
import { BlockRenderer } from "../../blocks/BlockRenderer";
import { Loader, EmptyState } from "../../components";
import styles from "./CmsPage.module.css";

/**
 * Public CMS page — loads Page document by slug and renders blocks.
 * Home uses slug "home"; all future shelves use the same component.
 */
function CmsPage({ slug: slugProp, preview = false }) {
  const params = useParams();
  const slug = slugProp || params.slug || "home";
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      let lastError = null;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const data = await getPageBySlug(slug, { preview });
          if (!cancelled) {
            setPage(data);
            setError("");
          }
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          // Render free-tier API often needs a warm-up on first hit.
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1200));
          }
        }
      }
      if (!cancelled && lastError) {
        setPage(null);
        setError(
          lastError.message ||
            "Could not load this page. The API may be waking up — try again."
        );
      }
      if (!cancelled) setLoading(false);
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

  if (loading) {
    return (
      <div className={styles.state}>
        <Loader label="Opening the page…" />
      </div>
    );
  }

  if (error || !page) {
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

  return (
    <div className={styles.page}>
      <BlockRenderer blocks={page.blocks || []} preview={preview} />
    </div>
  );
}

export default CmsPage;

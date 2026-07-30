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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPageBySlug(slug, { preview });
        if (!cancelled) setPage(data);
      } catch (err) {
        if (!cancelled) {
          setPage(null);
          setError(err.message || "Page not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, preview]);

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
          title="Page not found"
          description={error || "This page has not been published yet."}
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

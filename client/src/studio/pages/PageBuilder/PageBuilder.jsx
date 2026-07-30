import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { STUDIO } from "../../../constants";
import { getAdminPage, updatePage } from "../../../services/page.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import StudioLoader from "../../components/StudioLoader/StudioLoader";
import { BlockRenderer } from "../../../blocks/BlockRenderer";
import {
  PAGE_BLOCK_TYPES,
  createBlock,
  blockLabel,
  pagePath,
} from "../../../blocks/blockTypes";
import BlockFields from "./BlockFields";
import styles from "./PageBuilder.module.css";

/**
 * Block-based page builder — reorder, enable/disable, edit, preview.
 */
function PageBuilder() {
  const { id } = useParams();
  const dragIndex = useRef(null);

  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("edit"); // edit | preview
  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    status: "draft",
    showInNav: false,
    navLabel: "",
    navOrder: 100,
    seoTitle: "",
    seoDescription: "",
  });

  useStudioPage({
    title: "Edit page",
    wide: true,
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Pages", href: STUDIO.PAGES },
      { label: "Builder" },
    ],
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminPage(id);
      setPage(data);
      setBlocks(data.blocks || []);
      setMeta({
        title: data.title || "",
        slug: data.slug || "",
        status: data.status || "draft",
        showInNav: Boolean(data.showInNav),
        navLabel: data.navLabel || "",
        navOrder: data.navOrder ?? 100,
        seoTitle: data.seo?.title || "",
        seoDescription: data.seo?.description || "",
      });
      setSelectedId(data.blocks?.[0]?.id || null);
    } catch (err) {
      setError(err.message || "Could not load page");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = blocks.find((b) => b.id === selectedId) || null;

  function updateBlocks(next) {
    setBlocks(next);
  }

  function patchBlock(blockId, partial) {
    updateBlocks(
      blocks.map((b) => (b.id === blockId ? { ...b, ...partial } : b))
    );
  }

  function addBlock(type) {
    const block = createBlock(type);
    updateBlocks([...blocks, block]);
    setSelectedId(block.id);
  }

  function removeBlock(blockId) {
    const next = blocks.filter((b) => b.id !== blockId);
    updateBlocks(next);
    if (selectedId === blockId) setSelectedId(next[0]?.id || null);
  }

  function onDragStart(index) {
    dragIndex.current = index;
  }

  function onDragOver(e, index) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === index) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    updateBlocks(next);
  }

  async function save(statusOverride) {
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: meta.title,
        slug: meta.slug,
        status: statusOverride || meta.status,
        showInNav: meta.showInNav,
        navLabel: meta.navLabel,
        navOrder: Number(meta.navOrder) || 100,
        seo: {
          title: meta.seoTitle,
          description: meta.seoDescription,
        },
        blocks,
      };
      const saved = await updatePage(id, payload);
      setPage(saved);
      setBlocks(saved.blocks || []);
      setMeta((m) => ({ ...m, status: saved.status, slug: saved.slug }));
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <StudioLoader label="Opening page builder…" />;
  if (!page) {
    return (
      <p className={styles.error} role="alert">
        {error || "Page not found"}
      </p>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barLeft}>
          <Link to={STUDIO.PAGES} className={styles.back}>
            ← Pages
          </Link>
          <input
            className={styles.titleInput}
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            aria-label="Page title"
          />
        </div>
        <div className={styles.barRight}>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setMode(mode === "preview" ? "edit" : "preview")}
          >
            {mode === "preview" ? "Edit" : "Preview"}
          </button>
          <a
            className={styles.ghostBtn}
            href={pagePath(meta.slug)}
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={saving}
            onClick={() => save("draft")}
          >
            Draft
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={saving}
            onClick={() => save("published")}
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {mode === "preview" ? (
        <div className={styles.previewShell}>
          <BlockRenderer blocks={blocks} preview />
        </div>
      ) : (
        <div className={styles.layout}>
          <aside className={styles.rail}>
            <h2 className={styles.railTitle}>Blocks</h2>
            <ul className={styles.blockList}>
              {blocks.map((block, index) => (
                <li
                  key={block.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={(e) => e.preventDefault()}
                  className={`${styles.blockItem} ${selectedId === block.id ? styles.blockActive : ""} ${!block.enabled ? styles.blockOff : ""}`}
                >
                  <button
                    type="button"
                    className={styles.blockSelect}
                    onClick={() => setSelectedId(block.id)}
                  >
                    <span className={styles.drag}>⠿</span>
                    <span>{blockLabel(block.type)}</span>
                  </button>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={block.enabled !== false}
                      onChange={(e) =>
                        patchBlock(block.id, { enabled: e.target.checked })
                      }
                      aria-label="Enable block"
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => removeBlock(block.id)}
                    aria-label="Delete block"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <details className={styles.addPanel}>
              <summary>Add block</summary>
              <div className={styles.addGrid}>
                {PAGE_BLOCK_TYPES.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addBlock(t.type)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </details>
          </aside>

          <section className={styles.canvas}>
            <h2 className={styles.railTitle}>Settings</h2>
            {selected ? (
              <BlockFields
                block={selected}
                onChange={(data) => patchBlock(selected.id, { data })}
              />
            ) : (
              <p className={styles.hint}>Select a block to edit its content.</p>
            )}
          </section>

          <aside className={styles.meta}>
            <h2 className={styles.railTitle}>Page</h2>
            <label className={styles.field}>
              <span>Slug</span>
              <input
                value={meta.slug}
                onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span>Status</span>
              <select
                value={meta.status}
                onChange={(e) => setMeta({ ...meta, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={meta.showInNav}
                onChange={(e) =>
                  setMeta({ ...meta, showInNav: e.target.checked })
                }
              />
              Show in navigation
            </label>
            <label className={styles.field}>
              <span>Nav label</span>
              <input
                value={meta.navLabel}
                onChange={(e) => setMeta({ ...meta, navLabel: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span>Nav order</span>
              <input
                type="number"
                value={meta.navOrder}
                onChange={(e) => setMeta({ ...meta, navOrder: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span>SEO title</span>
              <input
                value={meta.seoTitle}
                onChange={(e) => setMeta({ ...meta, seoTitle: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span>SEO description</span>
              <textarea
                rows={3}
                value={meta.seoDescription}
                onChange={(e) =>
                  setMeta({ ...meta, seoDescription: e.target.value })
                }
              />
            </label>
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={saving}
              onClick={() => save()}
            >
              Save changes
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default PageBuilder;

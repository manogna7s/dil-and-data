import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STUDIO } from "../../../constants";
import {
  listMedia,
  listFolders,
  uploadMedia,
  updateMedia,
  deleteMedia,
  bulkDeleteMedia,
  replaceMedia,
} from "../../../services/media.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import StudioLoader from "../../components/StudioLoader/StudioLoader";
import ImageCropModal from "../../components/media/ImageCropModal";
import {
  MEDIA_FOLDERS,
  formatBytes,
  isImageMedia,
  isVideoMedia,
  isPdfMedia,
  mediaLabel,
} from "../../utils/mediaHelpers";
import styles from "./MediaLibrary.module.css";

/**
 * Professional Cloudinary media manager for Creator Studio.
 */
function MediaLibrary() {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState(
    MEDIA_FOLDERS.map((name) => ({ name, count: 0 }))
  );
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("all");
  const [resourceType, setResourceType] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [active, setActive] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [savingMeta, setSavingMeta] = useState(false);

  useStudioPage({
    title: "Media",
    wide: true,
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Media" },
    ],
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim());
      setPage(1);
    }, 320);
    return () => clearTimeout(t);
  }, [q]);

  const loadFolders = useCallback(async () => {
    try {
      const data = await listFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch {
      setFolders(MEDIA_FOLDERS.map((name) => ({ name, count: 0 })));
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMedia({
        q: search || undefined,
        folder,
        resourceType,
        page,
        limit: 36,
      });
      setItems(data?.items || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(err.message || "Could not load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, folder, resourceType, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const uploadTargetFolder = folder === "all" ? "gallery" : folder;

  async function processFiles(fileList) {
    const files = [...fileList].filter(Boolean);
    if (!files.length) return;

    for (const file of files) {
      const tempId = `${Date.now()}-${file.name}-${Math.random()}`;
      setUploads((prev) => [
        ...prev,
        { id: tempId, name: file.name, progress: 0, error: "" },
      ]);

      try {
        await uploadMedia(file, {
          folder: uploadTargetFolder,
          title: file.name.replace(/\.[^.]+$/, ""),
          onProgress: (progress) => {
            setUploads((prev) =>
              prev.map((u) => (u.id === tempId ? { ...u, progress } : u))
            );
          },
        });
        setUploads((prev) => prev.filter((u) => u.id !== tempId));
      } catch (err) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === tempId
              ? { ...u, error: err.message || "Upload failed", progress: 0 }
              : u
          )
        );
      }
    }

    await load();
    await loadFolders();
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(items.map((item) => item._id)));
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} asset${ids.length > 1 ? "s" : ""} from Cloudinary?`)) {
      return;
    }
    try {
      await bulkDeleteMedia(ids);
      setSelected(new Set());
      if (active && ids.includes(active._id)) setActive(null);
      await load();
      await loadFolders();
    } catch (err) {
      setError(err.message || "Bulk delete failed");
    }
  }

  async function handleDeleteOne(item) {
    if (!window.confirm(`Delete “${mediaLabel(item)}”?`)) return;
    try {
      await deleteMedia(item._id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
      if (active?._id === item._id) setActive(null);
      await load();
      await loadFolders();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  async function saveActiveMeta(partial) {
    if (!active) return;
    setSavingMeta(true);
    setError("");
    try {
      const updated = await updateMedia(active._id, partial);
      setActive(updated);
      setItems((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      if (partial.folder) await loadFolders();
    } catch (err) {
      setError(err.message || "Could not save details");
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleReplaceFile(file) {
    if (!active || !file) return;
    const tempId = `replace-${active._id}`;
    setUploads((prev) => [
      ...prev,
      { id: tempId, name: `Replace: ${file.name}`, progress: 0, error: "" },
    ]);
    try {
      const updated = await replaceMedia(active._id, file, {
        folder: active.folder || uploadTargetFolder,
        onProgress: (progress) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === tempId ? { ...u, progress } : u))
          );
        },
      });
      setUploads((prev) => prev.filter((u) => u.id !== tempId));
      setActive(updated);
      await load();
    } catch (err) {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === tempId ? { ...u, error: err.message || "Replace failed" } : u
        )
      );
    }
  }

  const selectedCount = selected.size;
  const folderTabs = useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, f.count]));
    return MEDIA_FOLDERS.map((name) => ({ name, count: map[name] || 0 }));
  }, [folders]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Cloudinary library</p>
          <h1 className={styles.title}>Media</h1>
          <p className={styles.lede}>
            Upload, organize, and select photographs, video, and PDFs for the journal.
          </p>
        </div>
        <div className={styles.headerActions}>
          {selectedCount > 0 && (
            <button type="button" className={styles.dangerBtn} onClick={handleBulkDelete}>
              Delete {selectedCount}
            </button>
          )}
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className={styles.hidden}
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
            onChange={(e) => {
              processFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <input
            ref={replaceInputRef}
            type="file"
            className={styles.hidden}
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReplaceFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      <div className={styles.folders} role="tablist" aria-label="Folders">
        <button
          type="button"
          role="tab"
          aria-selected={folder === "all"}
          className={`${styles.folderTab} ${folder === "all" ? styles.folderActive : ""}`}
          onClick={() => {
            setFolder("all");
            setPage(1);
          }}
        >
          All
        </button>
        {folderTabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            role="tab"
            aria-selected={folder === tab.name}
            className={`${styles.folderTab} ${folder === tab.name ? styles.folderActive : ""}`}
            onClick={() => {
              setFolder(tab.name);
              setPage(1);
            }}
          >
            {tab.name}
            <span>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search title, alt, caption…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search media"
        />
        <select
          aria-label="Filter type"
          value={resourceType}
          onChange={(e) => {
            setResourceType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="raw">PDFs / raw</option>
        </select>
        <button type="button" className={styles.ghostBtn} onClick={toggleSelectAll}>
          {selected.size === items.length && items.length ? "Clear selection" : "Select all"}
        </button>
      </div>

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dropActive : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          processFiles(e.dataTransfer.files);
        }}
      >
        <p>
          Drag & drop images, videos, or PDFs
          {folder !== "all" ? ` into “${folder}”` : " into gallery"}
        </p>
      </div>

      {uploads.length > 0 && (
        <ul className={styles.progressList}>
          {uploads.map((u) => (
            <li key={u.id}>
              <div className={styles.progressHead}>
                <span>{u.name}</span>
                <span>{u.error || `${u.progress}%`}</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${u.error ? 0 : u.progress}%` }}
                />
              </div>
              {u.error && <p className={styles.uploadError}>{u.error}</p>}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.gridPane}>
          {loading ? (
            <StudioLoader label="Opening the library…" />
          ) : items.length === 0 ? (
            <StudioEmptyState
              title="This shelf is empty"
              description="Upload a file, or switch folders. Shelves are created automatically on Cloudinary when you upload."
              action={
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload media
                </button>
              }
            />
          ) : (
            <div className={styles.grid}>
              {items.map((item) => (
                <article
                  key={item._id}
                  className={`${styles.card} ${selected.has(item._id) ? styles.cardSelected : ""} ${active?._id === item._id ? styles.cardActive : ""}`}
                >
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={selected.has(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      aria-label={`Select ${mediaLabel(item)}`}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.thumbBtn}
                    onClick={() => setActive(item)}
                  >
                    <Thumb item={item} />
                  </button>
                  <div className={styles.cardMeta}>
                    <p className={styles.cardTitle}>{mediaLabel(item)}</p>
                    <p className={styles.cardSub}>
                      {item.folder || "gallery"} · {item.format || item.resourceType}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pager}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <aside className={styles.detail} aria-label="Asset details">
          {!active ? (
            <p className={styles.detailEmpty}>Select an asset to preview and edit details.</p>
          ) : (
            <>
              <div className={styles.preview}>
                <Preview item={active} />
              </div>
              <label className={styles.field}>
                <span>Name</span>
                <input
                  value={active.title || ""}
                  onChange={(e) => setActive({ ...active, title: e.target.value })}
                  onBlur={() => saveActiveMeta({ title: active.title })}
                />
              </label>
              <label className={styles.field}>
                <span>Alt text</span>
                <input
                  value={active.alt || ""}
                  onChange={(e) => setActive({ ...active, alt: e.target.value })}
                  onBlur={() => saveActiveMeta({ alt: active.alt })}
                />
              </label>
              <label className={styles.field}>
                <span>Caption</span>
                <textarea
                  rows={3}
                  value={active.caption || ""}
                  onChange={(e) => setActive({ ...active, caption: e.target.value })}
                  onBlur={() => saveActiveMeta({ caption: active.caption })}
                />
              </label>
              <label className={styles.field}>
                <span>Folder</span>
                <select
                  value={active.folder || "gallery"}
                  onChange={(e) => {
                    const next = e.target.value;
                    setActive({ ...active, folder: next });
                    saveActiveMeta({ folder: next });
                  }}
                >
                  {MEDIA_FOLDERS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <p className={styles.metaLine}>
                {formatBytes(active.bytes)}
                {active.width ? ` · ${active.width}×${active.height}` : ""}
                {savingMeta ? " · Saving…" : ""}
              </p>
              <div className={styles.detailActions}>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => window.open(active.url, "_blank", "noopener,noreferrer")}
                >
                  Open
                </button>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => replaceInputRef.current?.click()}
                >
                  Replace
                </button>
                {isImageMedia(active) && (
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => setCropSrc(active.url)}
                  >
                    Crop
                  </button>
                )}
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => handleDeleteOne(active)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {cropSrc && active && (
        <ImageCropModal
          src={cropSrc}
          fileName={mediaLabel(active)}
          onCancel={() => setCropSrc(null)}
          onConfirm={async (file) => {
            setCropSrc(null);
            await handleReplaceFile(file);
          }}
        />
      )}
    </div>
  );
}

function Thumb({ item }) {
  if (isVideoMedia(item)) {
    return (
      <div className={styles.thumbFallback}>
        <video src={item.url} muted preload="metadata" />
        <span>Video</span>
      </div>
    );
  }
  if (isPdfMedia(item)) {
    return (
      <div className={styles.thumbFallback}>
        <span>PDF</span>
      </div>
    );
  }
  return <img src={item.url} alt={item.alt || ""} loading="lazy" />;
}

function Preview({ item }) {
  if (isVideoMedia(item)) {
    return <video src={item.url} controls playsInline />;
  }
  if (isPdfMedia(item)) {
    return (
      <a href={item.url} target="_blank" rel="noreferrer" className={styles.pdfLink}>
        Open PDF preview
      </a>
    );
  }
  return <img src={item.url} alt={item.alt || mediaLabel(item)} />;
}

export default MediaLibrary;

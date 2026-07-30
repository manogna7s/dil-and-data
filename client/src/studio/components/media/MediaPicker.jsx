import { useCallback, useEffect, useRef, useState } from "react";
import {
  listMedia,
  listFolders,
  uploadMedia,
} from "../../../services/media.service.js";
import {
  MEDIA_FOLDERS,
  isImageMedia,
  isVideoMedia,
  isPdfMedia,
  mediaLabel,
} from "../../utils/mediaHelpers";
import styles from "./MediaPicker.module.css";

/**
 * Modal picker for inserting Cloudinary media into the editor / settings.
 * mode: "single" | "multiple"
 * accept: "image" | "video" | "raw" | "all"
 */
function MediaPicker({
  open,
  onClose,
  onSelect,
  mode = "single",
  accept = "image",
  title = "Choose media",
  initialFolder = "gallery",
}) {
  const fileRef = useRef(null);
  const [items, setItems] = useState([]);
  const [folder, setFolder] = useState(initialFolder);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    setFolder(initialFolder);
    setSelected(new Set());
    setQ("");
    setSearch("");
  }, [open, initialFolder]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim()), 280);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError("");
    try {
      await listFolders().catch(() => null);
      const data = await listMedia({
        q: search || undefined,
        folder: folder === "all" ? undefined : folder,
        resourceType: accept === "all" ? undefined : accept,
        limit: 48,
      });
      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Could not load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [open, search, folder, accept]);

  useEffect(() => {
    load();
  }, [load]);

  if (!open) return null;

  function toggle(id) {
    if (mode === "single") {
      setSelected(new Set([id]));
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirm() {
    const chosen = items.filter((item) => selected.has(item._id));
    if (!chosen.length) return;
    onSelect?.(mode === "single" ? chosen[0] : chosen);
    onClose?.();
  }

  async function handleUpload(files) {
    const list = [...files].filter(Boolean);
    if (!list.length) return;
    setUploading(true);
    setError("");
    try {
      let last = null;
      for (const file of list) {
        last = await uploadMedia(file, {
          folder: folder === "all" ? "gallery" : folder,
          onProgress: setProgress,
        });
      }
      await load();
      if (mode === "single" && last) {
        setSelected(new Set([last._id]));
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className={styles.scrim} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.panel}>
        <header className={styles.bar}>
          <h2>{title}</h2>
          <button type="button" className={styles.ghost} onClick={onClose}>
            Close
          </button>
        </header>

        <div className={styles.tools}>
          <input
            type="search"
            placeholder="Search library…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={folder} onChange={(e) => setFolder(e.target.value)}>
            <option value="all">All folders</option>
            {MEDIA_FOLDERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.primary}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </button>
          <input
            ref={fileRef}
            type="file"
            className={styles.hidden}
            multiple={mode === "multiple"}
            accept={
              accept === "video"
                ? "video/mp4,video/webm"
                : accept === "raw"
                  ? "application/pdf"
                  : accept === "all"
                    ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
                    : "image/jpeg,image/png,image/webp,image/gif"
            }
            onChange={(e) => {
              handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.grid}>
          {loading ? (
            <p className={styles.muted}>Loading…</p>
          ) : items.length === 0 ? (
            <p className={styles.muted}>No media in this shelf yet.</p>
          ) : (
            items.map((item) => (
              <button
                key={item._id}
                type="button"
                className={`${styles.card} ${selected.has(item._id) ? styles.selected : ""}`}
                onClick={() => toggle(item._id)}
              >
                <PickerThumb item={item} />
                <span>{mediaLabel(item)}</span>
              </button>
            ))
          )}
        </div>

        <footer className={styles.footer}>
          <span className={styles.muted}>
            {selected.size} selected
          </span>
          <button
            type="button"
            className={styles.primary}
            disabled={!selected.size}
            onClick={confirm}
          >
            Use selected
          </button>
        </footer>
      </div>
    </div>
  );
}

function PickerThumb({ item }) {
  if (isVideoMedia(item)) {
    return <div className={styles.fallback}>Video</div>;
  }
  if (isPdfMedia(item)) {
    return <div className={styles.fallback}>PDF</div>;
  }
  if (isImageMedia(item)) {
    return <img src={item.url} alt={item.alt || ""} loading="lazy" />;
  }
  return <div className={styles.fallback}>File</div>;
}

export default MediaPicker;

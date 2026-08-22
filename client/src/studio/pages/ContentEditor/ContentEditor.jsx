import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { STUDIO, ROUTES } from "../../../constants";
import { slugify } from "../../../utils";
import {
  getContent,
  createContent,
  updateContent,
  publishContent,
  draftContent,
} from "../../../services/content.service.js";
import { listAdminCategories } from "../../../services/category.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import RichTextEditor from "../../components/editor/RichTextEditor";
import MediaPicker from "../../components/media/MediaPicker";
import PolaroidItemsEditor from "../../components/PolaroidItemsEditor/PolaroidItemsEditor";
import StudioLoader from "../../components/StudioLoader/StudioLoader";
import { isPolaroidCategory } from "../../../utils/categoryLayout.js";
import {
  CONTENT_TYPE_OPTIONS,
  estimateReadingTime,
  toDatetimeLocal,
  fromDatetimeLocal,
  toMediaRef,
  normalizeMediaList,
} from "../../utils/contentHelpers";
import styles from "./ContentEditor.module.css";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  gallery: [],
  polaroidItems: [],
  videos: [],
  type: "blog",
  category: "",
  tagsText: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
  status: "draft",
  scheduledFor: "",
};

/**
 * Medium / Ghost-style writing room.
 * Autosaves drafts via PATCH /api/content/:id after create.
 */
function ContentEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === "new";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const previewOpen = searchParams.get("preview") === "1";

  const [contentId, setContentId] = useState(isNew ? null : routeId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Ready");
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [picker, setPicker] = useState(null);
  const bodyImageInsertRef = useRef(null);

  const dirtyRef = useRef(false);
  const formRef = useRef(form);
  const contentIdRef = useRef(contentId);
  const autosaveTimer = useRef(null);
  const creatingRef = useRef(false);

  formRef.current = form;
  contentIdRef.current = contentId;

  useEffect(() => {
    function onBeforeUnload(e) {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const readingTime = useMemo(
    () => estimateReadingTime(form.body),
    [form.body]
  );

  const selectedCategory = useMemo(
    () => categories.find((cat) => String(cat._id) === String(form.category)),
    [categories, form.category]
  );

  const polaroidMode = isPolaroidCategory(selectedCategory);

  useStudioPage({
    title: isNew ? "New story" : "Edit story",
    wide: true,
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Content", href: STUDIO.CONTENT },
      { label: isNew ? "New" : "Edit" },
    ],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await listAdminCategories();
        if (!cancelled) setCategories(Array.isArray(cats) ? cats : cats?.items || []);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const item = await getContent(routeId);
        if (cancelled) return;
        setContentId(item._id);
        setForm(hydrateForm(item));
        setSlugTouched(true);
        dirtyRef.current = false;
        setSaveLabel("Loaded");
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load story");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isNew, routeId]);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveNow({ silent: false });
      }
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  function patchForm(partial) {
    dirtyRef.current = true;
    setSaveLabel("Unsaved changes");
    setForm((prev) => {
      const next = { ...prev, ...partial };
      if (
        partial.title !== undefined &&
        !slugTouched &&
        (isNew || !contentIdRef.current)
      ) {
        next.slug = slugify(partial.title);
      }
      return next;
    });
    scheduleAutosave();
  }

  function scheduleAutosave() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveNow({ silent: true });
    }, 1600);
  }

  const buildPayload = useCallback((state) => {
    const tags = String(state.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return {
      title: state.title.trim() || "Untitled",
      slug: state.slug.trim() || undefined,
      excerpt: state.excerpt,
      body: state.body,
      coverImage: state.coverImage.trim(),
      gallery: normalizeMediaList(state.gallery),
      polaroidItems: Array.isArray(state.polaroidItems)
        ? state.polaroidItems.map((item) => ({
            image: item.image || "",
            alt: item.alt || "",
            heading: item.heading || "",
            tagline: item.tagline || "",
            align: item.align === "right" ? "right" : "left",
          }))
        : [],
      videos: normalizeMediaList(state.videos),
      type: state.type,
      category: state.category || null,
      tags,
      featured: Boolean(state.featured),
      status: state.status === "archived" ? "archived" : state.status,
      scheduledFor: fromDatetimeLocal(state.scheduledFor),
      seo: {
        title: state.seoTitle,
        description: state.seoDescription,
        image: state.coverImage.trim(),
      },
    };
  }, []);

  async function saveNow({ silent = false, statusOverride } = {}) {
    const state = formRef.current;
    const hasPolaroid = Array.isArray(state.polaroidItems) && state.polaroidItems.some((i) => i?.image || i?.heading);
    if (!state.title.trim() && !state.body.trim() && !hasPolaroid) {
      if (!silent) setSaveLabel("Add a title to save");
      return null;
    }

    if (creatingRef.current) return null;

    setSaving(true);
    if (!silent) setError("");
    setSaveLabel("Saving…");

    try {
      const payload = buildPayload(state);
      if (statusOverride) payload.status = statusOverride;

      let saved;
      const id = contentIdRef.current;

      if (!id) {
        creatingRef.current = true;
        payload.status = statusOverride || "draft";
        saved = await createContent(payload);
        setContentId(saved._id);
        contentIdRef.current = saved._id;
        creatingRef.current = false;
        navigate(`/studio/content/${saved._id}`, { replace: true });
      } else {
        saved = await updateContent(id, payload);
      }

      dirtyRef.current = false;
      const stillEditing =
        formRef.current.body !== state.body ||
        formRef.current.title !== state.title ||
        formRef.current.excerpt !== state.excerpt;
      if (!stillEditing) {
        setForm(hydrateForm(saved));
        dirtyRef.current = false;
      } else {
        setForm((prev) => ({
          ...prev,
          slug: saved.slug || prev.slug,
          status: saved.status || prev.status,
        }));
        dirtyRef.current = true;
      }
      setSlugTouched(true);
      setSaveLabel(
        stillEditing
          ? "Saved · local edits pending"
          : `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      );
      return saved;
    } catch (err) {
      creatingRef.current = false;
      setSaveLabel("Save failed");
      if (!silent) setError(err.message || "Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const saved = await saveNow({ silent: false, statusOverride: "published" });
    if (!saved) return;
    try {
      await publishContent(saved._id);
      const fresh = await getContent(saved._id);
      setForm(hydrateForm(fresh));
      setSaveLabel("Published");
    } catch (err) {
      setError(err.message || "Publish failed");
    }
  }

  async function handleDraft() {
    const saved = await saveNow({ silent: false, statusOverride: "draft" });
    if (!saved) return;
    try {
      await draftContent(saved._id);
      const fresh = await getContent(saved._id);
      setForm(hydrateForm(fresh));
      setSaveLabel("Saved as draft");
    } catch (err) {
      setError(err.message || "Could not set draft");
    }
  }

  async function handleSchedule() {
    if (!form.scheduledFor) {
      setError("Choose a schedule date and time first.");
      return;
    }
    const saved = await saveNow({ silent: false, statusOverride: "draft" });
    if (saved) {
      setSaveLabel("Scheduled. Publishes automatically at that time");
    }
  }

  function setPreview(open) {
    if (open) setSearchParams({ preview: "1" });
    else setSearchParams({});
  }

  if (loading) {
    return <StudioLoader label="Opening the page…" />;
  }

  return (
    <div
      className={`${styles.page} ${fullscreen ? styles.fullscreen : ""}`}
    >
      <header className={styles.bar}>
        <div className={styles.barLeft}>
          {!fullscreen && (
            <Link to={STUDIO.CONTENT} className={styles.back}>
              ← Desk
            </Link>
          )}
          <span className={styles.saveStatus} aria-live="polite">
            {saving ? "Saving…" : saveLabel}
          </span>
          <span className={styles.readMeta}>{readingTime} min read</span>
        </div>
        <div className={styles.barRight}>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setSettingsOpen((v) => !v)}
          >
            {settingsOpen ? "Hide settings" : "Settings"}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setFullscreen((v) => !v)}
          >
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={saving}
            onClick={() => saveNow({ silent: false })}
          >
            Save
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={saving}
            onClick={handleDraft}
          >
            Draft
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={saving}
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.workspace}>
        <div className={styles.canvas}>
          <input
            className={styles.titleInput}
            value={form.title}
            onChange={(e) => patchForm({ title: e.target.value })}
            placeholder="Title"
            aria-label="Title"
          />
          {polaroidMode ? (
            <PolaroidItemsEditor
              items={form.polaroidItems}
              onChange={(polaroidItems) => patchForm({ polaroidItems })}
            />
          ) : (
            <RichTextEditor
              value={form.body}
              onChange={(html) => patchForm({ body: html })}
              placeholder="Tell the story… Use ## for headings, ** for bold, - for lists."
              onInsertImage={(insert) => {
                bodyImageInsertRef.current = insert;
                setPicker({
                  purpose: "body",
                  accept: "image",
                  mode: "single",
                  folder: "gallery",
                  title: "Insert image",
                });
              }}
            />
          )}
        </div>

        {settingsOpen && !fullscreen && (
          <aside className={styles.settings} aria-label="Blog settings">
            <h2 className={styles.settingsTitle}>Settings</h2>

            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patchForm({ slug: slugify(e.target.value) });
                }}
                placeholder="url-slug"
              />
            </Field>

            <Field label="Excerpt">
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => patchForm({ excerpt: e.target.value })}
                placeholder="A soft line for cards and SEO…"
                maxLength={500}
              />
            </Field>

            <Field label="Cover image">
              <div className={styles.mediaRow}>
                <input
                  value={form.coverImage}
                  onChange={(e) => patchForm({ coverImage: e.target.value })}
                  placeholder="https:// or choose from library"
                />
                <button
                  type="button"
                  className={styles.mediaBtn}
                  onClick={() =>
                    setPicker({
                      purpose: "cover",
                      accept: "image",
                      mode: "single",
                      folder: "covers",
                      title: "Choose cover",
                    })
                  }
                >
                  Library
                </button>
              </div>
              {form.coverImage && (
                <img src={form.coverImage} alt="" className={styles.coverThumb} />
              )}
            </Field>

            <Field label="Gallery">
              <div className={styles.mediaChips}>
                {form.gallery.map((item, index) => (
                  <div key={`${item.url}-${index}`} className={styles.chip}>
                    <img src={item.url} alt={item.alt || ""} />
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() =>
                        patchForm({
                          gallery: form.gallery.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.mediaBtn}
                onClick={() =>
                  setPicker({
                    purpose: "gallery",
                    accept: "image",
                    mode: "multiple",
                    folder: "gallery",
                    title: "Add gallery images",
                  })
                }
              >
                Add from library
              </button>
            </Field>

            <Field label="Videos">
              <div className={styles.mediaChips}>
                {form.videos.map((item, index) => (
                  <div key={`${item.url}-${index}`} className={styles.videoChip}>
                    <span>{item.url.split("/").pop()}</span>
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() =>
                        patchForm({
                          videos: form.videos.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.mediaBtn}
                onClick={() =>
                  setPicker({
                    purpose: "videos",
                    accept: "video",
                    mode: "multiple",
                    folder: "videos",
                    title: "Add videos",
                  })
                }
              >
                Add from library
              </button>
            </Field>

            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => patchForm({ type: e.target.value })}
              >
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => patchForm({ category: e.target.value })}
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                    {cat.layout === "polaroid" ? " · polaroid" : ""}
                  </option>
                ))}
              </select>
              {polaroidMode && (
                <p className={styles.hint}>
                  Polaroid bucket list — add photos with headings in the editor above.
                </p>
              )}
            </Field>

            <Field label="Tags (comma separated)">
              <input
                value={form.tagsText}
                onChange={(e) => patchForm({ tagsText: e.target.value })}
                placeholder="letters, quiet, home"
              />
            </Field>

            <Field label="SEO title">
              <input
                value={form.seoTitle}
                onChange={(e) => patchForm({ seoTitle: e.target.value })}
                maxLength={120}
              />
            </Field>

            <Field label="SEO description">
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) => patchForm({ seoDescription: e.target.value })}
                maxLength={300}
              />
            </Field>

            <label className={styles.check}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => patchForm({ featured: e.target.checked })}
              />
              Featured on the home shelf
            </label>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => patchForm({ status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>

            <Field label="Schedule">
              <input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => patchForm({ scheduledFor: e.target.value })}
              />
            </Field>

            <button
              type="button"
              className={styles.scheduleBtn}
              disabled={saving}
              onClick={handleSchedule}
            >
              Save schedule
            </button>

            <p className={styles.hint}>
              Reading time updates from the body (~{readingTime} min). Autosave
              runs after you pause typing. Ctrl/Cmd+S saves now.
            </p>

            {form.status === "published" && form.slug && (
              <a
                className={styles.publicLink}
                href={`${ROUTES.BLOGS}/${form.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Open live page →
              </a>
            )}
          </aside>
        )}
      </div>

      {previewOpen && (
        <div
          className={styles.previewScrim}
          role="dialog"
          aria-modal="true"
          aria-label="Preview"
        >
          <div className={styles.previewPanel}>
            <div className={styles.previewBar}>
              <span>Preview</span>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setPreview(false)}
              >
                Close
              </button>
            </div>
            <article className={styles.previewArticle}>
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt=""
                  className={styles.previewCover}
                />
              )}
              <p className={styles.previewMeta}>
                {form.type} · {readingTime} min read
                {form.featured ? " · Featured" : ""}
              </p>
              <h1>{form.title || "Untitled"}</h1>
              {form.excerpt && (
                <p className={styles.previewExcerpt}>{form.excerpt}</p>
              )}
              <div
                className={styles.previewBody}
                dangerouslySetInnerHTML={{ __html: form.body || "<p></p>" }}
              />
            </article>
          </div>
        </div>
      )}

      <MediaPicker
        open={Boolean(picker)}
        title={picker?.title || "Choose media"}
        mode={picker?.mode || "single"}
        accept={picker?.accept || "image"}
        initialFolder={picker?.folder || "gallery"}
        onClose={() => {
          bodyImageInsertRef.current = null;
          setPicker(null);
        }}
        onSelect={(selection) => {
          const purpose = picker?.purpose;
          if (purpose === "cover") {
            const item = Array.isArray(selection) ? selection[0] : selection;
            if (item) patchForm({ coverImage: item.url });
          } else if (purpose === "gallery") {
            const list = (Array.isArray(selection) ? selection : [selection])
              .map(toMediaRef)
              .filter(Boolean);
            patchForm({ gallery: [...form.gallery, ...list] });
          } else if (purpose === "videos") {
            const list = (Array.isArray(selection) ? selection : [selection])
              .map(toMediaRef)
              .filter(Boolean);
            patchForm({ videos: [...form.videos, ...list] });
          } else if (purpose === "body") {
            const item = Array.isArray(selection) ? selection[0] : selection;
            bodyImageInsertRef.current?.(item?.url, item?.alt || "");
            bodyImageInsertRef.current = null;
          }
          setPicker(null);
        }}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function hydrateForm(item) {
  return {
    title: item.title || "",
    slug: item.slug || "",
    excerpt: item.excerpt || "",
    body: item.body || "",
    coverImage: item.coverImage || "",
    gallery: normalizeMediaList(item.gallery),
    polaroidItems: Array.isArray(item.polaroidItems)
      ? item.polaroidItems.map((row) => ({
          image: row.image || "",
          alt: row.alt || "",
          heading: row.heading || "",
          tagline: row.tagline || "",
          align: row.align === "right" ? "right" : "left",
        }))
      : [],
    videos: normalizeMediaList(item.videos),
    type: item.type || "blog",
    category: item.category?._id || item.category || "",
    tagsText: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    seoTitle: item.seo?.title || "",
    seoDescription: item.seo?.description || "",
    featured: Boolean(item.featured),
    status: item.status || "draft",
    scheduledFor: toDatetimeLocal(item.scheduledFor),
  };
}

export default ContentEditor;

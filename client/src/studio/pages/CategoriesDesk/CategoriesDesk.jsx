import { useCallback, useEffect, useState } from "react";
import { STUDIO } from "../../../constants";
import {
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/category.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import { useToast, useConfirm, TableSkeleton } from "../../components/ux";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import MediaPicker from "../../components/media/MediaPicker";
import desk from "../../styles/desk.module.css";

const BLANK = {
  title: "",
  description: "",
  coverImage: "",
  isActive: true,
  layout: "default",
};

function CategoriesDesk() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useStudioPage({
    title: "Categories",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Categories" },
    ],
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Could not load categories");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      coverImage: item.coverImage || "",
      isActive: item.isActive !== false,
      layout: item.layout === "polaroid" ? "polaroid" : "default",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(BLANK);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      coverImage: form.coverImage.trim(),
      isActive: Boolean(form.isActive),
      layout: form.layout === "polaroid" ? "polaroid" : "default",
    };
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      resetForm();
      await load();
    } catch (err) {
      const detail = Array.isArray(err.errors)
        ? err.errors.map((e) => e.message).filter(Boolean).join(" · ")
        : "";
      toast.error(detail || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const ok = await confirm({
      title: "Delete category?",
      message: `Remove “${item.title}”? Stories using it must be reassigned first.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deleteCategory(item._id);
      toast.success("Category deleted");
      if (editingId === item._id) resetForm();
      await load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div className={desk.page}>
      <header className={desk.header}>
        <div>
          <p className={desk.eyebrow}>Shelves</p>
          <h1 className={desk.title}>Categories</h1>
          <p className={desk.lede}>
            Organize Shakti's Blog: travel, books, diary, and whatever else you invent.
          </p>
        </div>
      </header>

      <div className={desk.split || undefined} style={{ display: "grid", gridTemplateColumns: "minmax(16rem, 22rem) 1fr", gap: "2rem", alignItems: "start" }}>
        <form className={desk.formStack} onSubmit={handleSave}>
          <h2 className={desk.sectionRule}>
            {editingId ? "Edit category" : "New category"}
          </h2>
          <label className={desk.field}>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </label>
          <label className={desk.field}>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>
          <label className={desk.field}>
            Page layout
            <select
              value={form.layout}
              onChange={(e) => setForm((f) => ({ ...f, layout: e.target.value }))}
            >
              <option value="default">Standard stories</option>
              <option value="polaroid">Polaroid bucket list</option>
            </select>
          </label>
          {form.layout === "polaroid" && (
            <p className={desk.muted} style={{ textTransform: "none", letterSpacing: "normal" }}>
              Stories in this category get floating polaroid photos with heading + tagline beside
              each image (left or right).
            </p>
          )}
          <div className={desk.field}>
            <span>Cover image</span>
            {form.coverImage ? (
              <img
                src={form.coverImage}
                alt=""
                style={{
                  width: "100%",
                  maxHeight: "8rem",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                }}
              />
            ) : (
              <p className={desk.muted} style={{ textTransform: "none", letterSpacing: "normal" }}>
                Optional — shows on the public categories page.
              </p>
            )}
            <div className={desk.toolbar}>
              <button
                type="button"
                className={desk.btn}
                onClick={() => setCoverPickerOpen(true)}
              >
                {form.coverImage ? "Change image" : "Upload or choose"}
              </button>
              {form.coverImage && (
                <button
                  type="button"
                  className={desk.ghostBtn}
                  onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <label className={desk.field} style={{ flexDirection: "row", alignItems: "center", textTransform: "none" }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            Active on the public site
          </label>
          <div className={desk.toolbar}>
            <button type="submit" className={desk.primaryBtn} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" className={desk.ghostBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          {items.length === 0 ? (
            <StudioEmptyState
              title="No categories yet"
              description="Create your first shelf to organize stories."
            />
          ) : (
            <div className={desk.tableWrap}>
              <table className={desk.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Layout</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.title}</strong>
                        {item.description && (
                          <p className={desk.muted}>{item.description}</p>
                        )}
                      </td>
                      <td>{item.layout === "polaroid" ? "Polaroid" : "Standard"}</td>
                      <td>{item.isActive === false ? "Hidden" : "Active"}</td>
                      <td>
                        <div className={desk.actions}>
                          <button
                            type="button"
                            className={desk.action}
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`${desk.action} ${desk.actionDanger}`}
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <MediaPicker
        open={coverPickerOpen}
        title="Choose category cover"
        mode="single"
        accept="image"
        initialFolder="covers"
        onClose={() => setCoverPickerOpen(false)}
        onSelect={(item) => {
          const media = Array.isArray(item) ? item[0] : item;
          if (media?.url) {
            setForm((f) => ({ ...f, coverImage: media.url }));
          }
          setCoverPickerOpen(false);
        }}
      />
    </div>
  );
}

export default CategoriesDesk;

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
import desk from "../../styles/desk.module.css";

const BLANK = {
  title: "",
  description: "",
  coverImage: "",
  isActive: true,
};

function CategoriesDesk() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success("Category updated");
      } else {
        await createCategory(form);
        toast.success("Category created");
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error(err.message || "Save failed");
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
            Cover image URL
            <input
              value={form.coverImage}
              onChange={(e) =>
                setForm((f) => ({ ...f, coverImage: e.target.value }))
              }
              placeholder="Paste a media library URL"
            />
          </label>
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
    </div>
  );
}

export default CategoriesDesk;

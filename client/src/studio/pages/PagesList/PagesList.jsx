import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STUDIO } from "../../../constants";
import {
  listAdminPages,
  createPage,
  deletePage,
} from "../../../services/page.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import StudioLoader from "../../components/StudioLoader/StudioLoader";
import { pagePath } from "../../../blocks/blockTypes";
import styles from "./PagesList.module.css";

function PagesList() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  useStudioPage({
    title: "Pages",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Pages" },
    ],
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listAdminPages();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load pages");
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError("");
    try {
      const page = await createPage({
        title: title.trim(),
        status: "draft",
        showInNav: true,
        blocks: [],
      });
      setTitle("");
      navigate(`/studio/pages/${page._id}`);
    } catch (err) {
      setError(err.message || "Could not create page");
      setCreating(false);
    }
  }

  async function handleDelete(page) {
    if (!window.confirm(`Delete page “${page.title}”?`)) return;
    try {
      await deletePage(page._id);
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Page builder</p>
          <h1 className={styles.title}>Pages</h1>
          <p className={styles.lede}>
            Block-driven pages for Home, About, and every future shelf. No React edits required.
          </p>
        </div>
      </header>

      <form className={styles.create} onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New page title (e.g. Monthly Letter)"
          aria-label="New page title"
        />
        <button type="submit" className={styles.primaryBtn} disabled={creating}>
          {creating ? "Creating…" : "Add page"}
        </button>
      </form>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <StudioLoader label="Loading pages…" />
      ) : pages.length === 0 ? (
        <StudioEmptyState
          title="No pages yet"
          description="Run npm run seed:pages on the server, or create your first page here."
        />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Nav</th>
                <th>Blocks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page._id}>
                  <td>
                    <Link to={`/studio/pages/${page._id}`} className={styles.titleLink}>
                      {page.title}
                    </Link>
                  </td>
                  <td className={styles.muted}>{pagePath(page.slug)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[page.status] || ""}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className={styles.muted}>
                    {page.showInNav ? page.navLabel || page.title : "—"}
                  </td>
                  <td className={styles.muted}>{page.blocks?.length || 0}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/studio/pages/${page._id}`} className={styles.action}>
                        Edit
                      </Link>
                      <a
                        href={pagePath(page.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.action}
                      >
                        View
                      </a>
                      <button
                        type="button"
                        className={`${styles.action} ${styles.danger}`}
                        onClick={() => handleDelete(page)}
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
  );
}

export default PagesList;

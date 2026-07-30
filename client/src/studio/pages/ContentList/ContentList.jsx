import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STUDIO, ROUTES } from "../../../constants";
import {
  listAdminContent,
  updateContent,
  deleteContent,
  publishContent,
  draftContent,
  archiveContent,
  duplicateContent,
} from "../../../services/content.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import StudioLoader from "../../components/StudioLoader/StudioLoader";
import {
  CONTENT_TYPE_OPTIONS,
  CONTENT_STATUS_OPTIONS,
  CONTENT_SORT_OPTIONS,
  formatStudioDate,
} from "../../utils/contentHelpers";
import styles from "./ContentList.module.css";

/**
 * Publishing desk — search, filter, sort, and row actions
 * against GET /api/content/admin and related mutations.
 */
function ContentList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useStudioPage({
    title: "Content",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Content" },
    ],
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listAdminContent({
        q: search || undefined,
        status,
        featured,
        type,
        sort,
        page,
        limit: 20,
      });
      setItems(data?.items || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(err.message || "Could not load content");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, featured, type, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function runAction(id, fn) {
    setBusyId(id);
    setError("");
    try {
      await fn();
      await load();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  function confirmDelete(item) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    runAction(item._id, () => deleteContent(item._id));
  }

  function previewItem(item) {
    if (item.status === "published" && item.slug) {
      window.open(`${ROUTES.BLOGS}/${item.slug}`, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(`/studio/content/${item._id}?preview=1`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Publishing desk</p>
          <h1 className={styles.title}>Content</h1>
          <p className={styles.lede}>
            Search, sort, and shepherd drafts into the journal.
          </p>
        </div>
        <Link to={STUDIO.CONTENT_NEW} className={styles.primaryBtn}>
          New story
        </Link>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={styles.srOnly}>Search</span>
          <input
            type="search"
            placeholder="Search title, excerpt, tags…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <select
          aria-label="Filter status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {CONTENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter featured"
          value={featured}
          onChange={(e) => {
            setFeatured(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All visibility</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>

        <select
          aria-label="Filter type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All types</option>
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          {CONTENT_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <StudioLoader label="Loading the desk…" />
      ) : items.length === 0 ? (
        <StudioEmptyState
          title="No stories on the desk"
          description="Start a draft, or loosen your filters to see archived and published work."
          action={
            <Link to={STUDIO.CONTENT_NEW} className={styles.primaryBtn}>
              Write something new
            </Link>
          }
        />
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const busy = busyId === item._id;
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link
                          to={`/studio/content/${item._id}`}
                          className={styles.titleLink}
                        >
                          {item.title}
                        </Link>
                        {item.slug && (
                          <span className={styles.slug}>/{item.slug}</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.chip}>{item.type}</span>
                      </td>
                      <td>
                        <span
                          className={`${styles.status} ${styles[`status_${item.status}`] || ""}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{item.featured ? "Yes" : "—"}</td>
                      <td className={styles.muted}>
                        {formatStudioDate(item.updatedAt)}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.action}
                            disabled={busy}
                            onClick={() => navigate(`/studio/content/${item._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.action}
                            disabled={busy}
                            onClick={() => previewItem(item)}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className={styles.action}
                            disabled={busy}
                            onClick={() =>
                              runAction(item._id, () => duplicateContent(item))
                            }
                          >
                            Duplicate
                          </button>
                          {item.status === "published" ? (
                            <button
                              type="button"
                              className={styles.action}
                              disabled={busy}
                              onClick={() =>
                                runAction(item._id, () => draftContent(item._id))
                              }
                            >
                              Draft
                            </button>
                          ) : item.status !== "archived" ? (
                            <button
                              type="button"
                              className={styles.action}
                              disabled={busy}
                              onClick={() =>
                                runAction(item._id, () => publishContent(item._id))
                              }
                            >
                              Publish
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className={styles.action}
                            disabled={busy}
                            onClick={() =>
                              runAction(item._id, () =>
                                updateContent(item._id, {
                                  featured: !item.featured,
                                })
                              )
                            }
                          >
                            {item.featured ? "Unfeature" : "Feature"}
                          </button>
                          {item.status !== "archived" && (
                            <button
                              type="button"
                              className={styles.action}
                              disabled={busy}
                              onClick={() =>
                                runAction(item._id, () => archiveContent(item._id))
                              }
                            >
                              Archive
                            </button>
                          )}
                          <button
                            type="button"
                            className={`${styles.action} ${styles.danger}`}
                            disabled={busy}
                            onClick={() => confirmDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
}

export default ContentList;

import { useCallback, useEffect, useState } from "react";
import { STUDIO } from "../../../constants";
import {
  listAdminComments,
  moderateComment,
  deleteComment,
  bulkModerateComments,
  bulkDeleteComments,
  replyToComment,
} from "../../../services/comment.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import { useToast, useConfirm, Modal, TableSkeleton } from "../../components/ux";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import desk from "../../styles/desk.module.css";

function CommentsDesk() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [replyFor, setReplyFor] = useState(null);
  const [replyBody, setReplyBody] = useState("");

  useStudioPage({
    title: "Comments",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Comments" },
    ],
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listAdminComments({
        q: search || undefined,
        status,
        page,
        limit: 20,
      });
      setItems(data?.items || []);
      setPagination(data?.pagination || null);
      setSelected(new Set());
    } catch (err) {
      setError(err.message || "Could not load comments");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatusFor(id, next) {
    const prev = items;
    setItems((list) =>
      list.map((c) => (c._id === id ? { ...c, status: next } : c))
    );
    try {
      await moderateComment(id, next);
      toast.success(`Marked as ${next}`);
    } catch (err) {
      setItems(prev);
      toast.error(err.message || "Moderation failed");
    }
  }

  async function removeOne(item) {
    const ok = await confirm({
      title: "Delete comment",
      message: `Remove the note from ${item.authorName}?`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deleteComment(item._id);
      toast.success("Comment deleted");
      await load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  async function runBulk(action) {
    const ids = [...selected];
    if (!ids.length) return;
    if (action === "delete") {
      const ok = await confirm({
        title: "Delete selected",
        message: `Delete ${ids.length} comment(s)?`,
        confirmLabel: "Delete",
        tone: "danger",
      });
      if (!ok) return;
      try {
        await bulkDeleteComments(ids);
        toast.success("Deleted");
        await load();
      } catch (err) {
        toast.error(err.message || "Bulk delete failed");
      }
      return;
    }
    try {
      await bulkModerateComments(ids, action);
      toast.success(`Marked as ${action}`);
      await load();
    } catch (err) {
      toast.error(err.message || "Bulk action failed");
    }
  }

  async function submitReply() {
    if (!replyFor || !replyBody.trim()) return;
    try {
      await replyToComment(replyFor._id, replyBody.trim());
      toast.success("Reply posted");
      setReplyFor(null);
      setReplyBody("");
      await load();
    } catch (err) {
      toast.error(err.message || "Reply failed");
    }
  }

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={desk.page}>
      <header className={desk.header}>
        <div>
          <p className={desk.eyebrow}>Moderation</p>
          <h1 className={desk.title}>Comments</h1>
          <p className={desk.lede}>
            Approve, reply, or quietly set aside notes from readers.
          </p>
        </div>
      </header>

      <div className={desk.toolbar}>
        <input
          type="search"
          placeholder="Search name, email, or text…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search comments"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="spam">Spam</option>
          <option value="rejected">Rejected</option>
        </select>
        {selected.size > 0 && (
          <>
            <button type="button" className={desk.btn} onClick={() => runBulk("approved")}>
              Approve ({selected.size})
            </button>
            <button type="button" className={desk.btn} onClick={() => runBulk("spam")}>
              Spam
            </button>
            <button type="button" className={desk.dangerBtn} onClick={() => runBulk("delete")}>
              Delete
            </button>
          </>
        )}
      </div>

      {error && (
        <p className={desk.error} role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <StudioEmptyState
          title="No comments"
          description="When readers leave notes, they will wait here for your eye."
        />
      ) : (
        <>
          <div className={desk.tableWrap}>
            <table className={desk.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={selected.size === items.length}
                      onChange={() => {
                        if (selected.size === items.length) setSelected(new Set());
                        else setSelected(new Set(items.map((i) => i._id)));
                      }}
                    />
                  </th>
                  <th>Author</th>
                  <th>Comment</th>
                  <th>Story</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(item._id)}
                        onChange={() => toggle(item._id)}
                        aria-label={`Select ${item.authorName}`}
                      />
                    </td>
                    <td>
                      <div>{item.authorName}</div>
                      <div className={desk.muted}>{item.authorEmail}</div>
                    </td>
                    <td>{item.body}</td>
                    <td className={desk.muted}>
                      {item.content?.title || "—"}
                    </td>
                    <td>
                      <span className={desk.status}>{item.status}</span>
                    </td>
                    <td>
                      <div className={desk.actions}>
                        {item.status !== "approved" && (
                          <button
                            type="button"
                            className={desk.action}
                            onClick={() => setStatusFor(item._id, "approved")}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          className={desk.action}
                          onClick={() => {
                            setReplyFor(item);
                            setReplyBody("");
                          }}
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          className={desk.action}
                          onClick={() => setStatusFor(item._id, "spam")}
                        >
                          Spam
                        </button>
                        <button
                          type="button"
                          className={`${desk.action} ${desk.actionDanger}`}
                          onClick={() => removeOne(item)}
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

          {pagination?.totalPages > 1 && (
            <div className={desk.pager}>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
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

      <Modal
        open={Boolean(replyFor)}
        title={replyFor ? `Reply to ${replyFor.authorName}` : "Reply"}
        onClose={() => setReplyFor(null)}
        footer={
          <>
            <button type="button" className={desk.ghostBtn} onClick={() => setReplyFor(null)}>
              Cancel
            </button>
            <button type="button" className={desk.primaryBtn} onClick={submitReply}>
              Post reply
            </button>
          </>
        }
      >
        <p className={desk.muted}>{replyFor?.body}</p>
        <label className={desk.field}>
          <span>Your reply</span>
          <textarea
            rows={5}
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
          />
        </label>
      </Modal>
    </div>
  );
}

export default CommentsDesk;

import { useCallback, useEffect, useState } from "react";
import { STUDIO } from "../../../constants";
import {
  listSubscribers,
  deleteSubscriber,
  exportSubscribersCsv,
} from "../../../services/subscriber.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import { useToast, useConfirm, TableSkeleton } from "../../components/ux";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import desk from "../../styles/desk.module.css";

function SubscribersDesk() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");
  const [page, setPage] = useState(1);

  useStudioPage({
    title: "Subscribers",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Subscribers" },
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
      const data = await listSubscribers({
        q: search || undefined,
        active,
        page,
        limit: 30,
      });
      setItems(data?.items || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(err.message || "Could not load subscribers");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, active, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function removeOne(item) {
    const ok = await confirm({
      title: "Remove subscriber",
      message: `Delete ${item.email} from the list?`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deleteSubscriber(item._id);
      toast.success("Subscriber removed");
      await load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  async function handleExport() {
    try {
      const csv = await exportSubscribersCsv({ active });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  }

  return (
    <div className={desk.page}>
      <header className={desk.header}>
        <div>
          <p className={desk.eyebrow}>Letters list</p>
          <h1 className={desk.title}>Subscribers</h1>
          <p className={desk.lede}>
            The quiet list of people who asked for soft letters.
          </p>
        </div>
        <button type="button" className={desk.primaryBtn} onClick={handleExport}>
          Export CSV
        </button>
      </header>

      <div className={desk.toolbar}>
        <input
          type="search"
          placeholder="Search email or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search subscribers"
        />
        <select
          value={active}
          onChange={(e) => {
            setActive(e.target.value);
            setPage(1);
          }}
          aria-label="Filter active"
        >
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Unsubscribed</option>
        </select>
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
          title="No subscribers yet"
          description="When someone joins the newsletter, their address will settle here."
        />
      ) : (
        <>
          <div className={desk.tableWrap}>
            <table className={desk.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.email}</td>
                    <td className={desk.muted}>{item.name || "—"}</td>
                    <td>
                      <span className={desk.status}>
                        {item.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className={desk.muted}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`${desk.action} ${desk.actionDanger}`}
                        onClick={() => removeOne(item)}
                      >
                        Delete
                      </button>
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
    </div>
  );
}

export default SubscribersDesk;

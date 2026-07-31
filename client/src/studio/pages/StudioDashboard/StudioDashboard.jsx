import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context";
import { STUDIO } from "../../../constants";
import { listAdminContent } from "../../../services/content.service.js";
import { listAdminComments } from "../../../services/comment.service.js";
import { listSubscribers } from "../../../services/subscriber.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import OverviewCard from "../../components/OverviewCard/OverviewCard";
import QuickActions from "../../components/QuickActions/QuickActions";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import styles from "./StudioDashboard.module.css";

const QUICK_ACTIONS = [
  {
    id: "write",
    label: "New story",
    description: "Open a blank page in your journal",
    to: STUDIO.CONTENT_NEW,
  },
  {
    id: "media",
    label: "Upload media",
    description: "Add photographs and soft frames",
    to: STUDIO.MEDIA,
  },
  {
    id: "comments",
    label: "Review comments",
    description: "Approve notes from readers",
    to: STUDIO.COMMENTS,
  },
];

/**
 * Dashboard homepage — live overview counts + quick actions.
 */
function StudioDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    published: "—",
    drafts: "—",
    comments: "—",
    subscribers: "—",
  });
  const [recent, setRecent] = useState([]);

  useStudioPage({
    title: "Dashboard",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Dashboard" },
    ],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [published, drafts, comments, subscribers] = await Promise.all([
          listAdminContent({ status: "published", limit: 1 }),
          listAdminContent({ status: "draft", limit: 5 }),
          listAdminComments({ status: "pending", limit: 1 }),
          listSubscribers({ limit: 1 }),
        ]);
        if (cancelled) return;
        setStats({
          published: published?.pagination?.total ?? 0,
          drafts: drafts?.pagination?.total ?? 0,
          comments: comments?.pagination?.total ?? 0,
          subscribers: subscribers?.pagination?.total ?? 0,
        });
        setRecent((drafts?.items || []).slice(0, 5));
      } catch {
        /* keep placeholders */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.greeting}>
          {greeting}, {user?.name?.split(" ")[0] || "creator"}
        </p>
        <p className={styles.lede}>
          Your quiet control room for stories, photographs, and letters.
        </p>
      </section>

      <section className={styles.section} aria-label="Overview">
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.cards}>
          <OverviewCard
            label="Published"
            value={String(stats.published)}
            hint="Stories live on the site"
            to={STUDIO.CONTENT}
          />
          <OverviewCard
            label="Drafts"
            value={String(stats.drafts)}
            hint="Waiting on the desk"
            to={STUDIO.CONTENT}
          />
          <OverviewCard
            label="Comments"
            value={String(stats.comments)}
            hint="Awaiting your eye"
            to={STUDIO.COMMENTS}
          />
          <OverviewCard
            label="Subscribers"
            value={String(stats.subscribers)}
            hint="Soft letters list"
            to={STUDIO.SUBSCRIBERS}
          />
        </div>
      </section>

      <section className={styles.section} aria-label="Quick actions">
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <p className={styles.hint}>
          To write a post that appears on your live site: open{" "}
          <strong>New story</strong> → type your title and body → click{" "}
          <strong>Publish</strong> at the top. Then visit <code>/blogs</code> on
          the public site.
        </p>
        <QuickActions actions={QUICK_ACTIONS} />
      </section>

      <section className={styles.section} aria-label="Recent activity">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recent drafts</h2>
          <button
            type="button"
            className={styles.link}
            onClick={() => navigate(STUDIO.CONTENT)}
          >
            Open content
          </button>
        </div>
        {recent.length === 0 ? (
          <StudioEmptyState
            title="No drafts yet"
            description="Once you write, a gentle trail of recent work will appear here."
            action={
              <button
                type="button"
                className={styles.cta}
                onClick={() => navigate(STUDIO.CONTENT_NEW)}
              >
                Start writing
              </button>
            }
          />
        ) : (
          <ul className={styles.activity}>
            {recent.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  className={styles.activityLink}
                  onClick={() => navigate(`${STUDIO.CONTENT}/${item._id}`)}
                >
                  {item.title || "Untitled"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default StudioDashboard;

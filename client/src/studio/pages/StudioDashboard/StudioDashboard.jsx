import { Link } from "react-router-dom";
import { useAuth } from "../../../context";
import { STUDIO } from "../../../constants";
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
 * Dashboard homepage — overview, quick actions, recent activity placeholders.
 * Stats will bind to live API aggregates in a later studio phase.
 */
function StudioDashboard() {
  const { user } = useAuth();

  useStudioPage({
    title: "Dashboard",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Dashboard" },
    ],
  });

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
            value="—"
            hint="Stories live on the site"
            to={STUDIO.CONTENT}
          />
          <OverviewCard
            label="Drafts"
            value="—"
            hint="Waiting on the desk"
            to={STUDIO.CONTENT}
          />
          <OverviewCard
            label="Comments"
            value="—"
            hint="Awaiting your eye"
            to={STUDIO.COMMENTS}
          />
          <OverviewCard
            label="Subscribers"
            value="—"
            hint="Soft letters list"
            to={STUDIO.SUBSCRIBERS}
          />
        </div>
      </section>

      <section className={styles.section} aria-label="Quick actions">
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <QuickActions actions={QUICK_ACTIONS} />
      </section>

      <section className={styles.section} aria-label="Recent activity">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recent activity</h2>
          <Link to={STUDIO.CONTENT} className={styles.link}>
            Open content
          </Link>
        </div>
        <StudioEmptyState
          title="No activity yet"
          description="Once you publish, edit, or approve comments, a gentle trail of recent work will appear here."
          action={
            <Link to={STUDIO.CONTENT} className={styles.cta}>
              Start writing
            </Link>
          }
        />
      </section>
    </div>
  );
}

export default StudioDashboard;

import { Link } from "react-router-dom";
import { STUDIO } from "../../../constants";
import useStudioPage from "../../hooks/useStudioPage";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import styles from "./StudioPlaceholder.module.css";

/**
 * Temporary destination for sidebar sections until Phase 5.2+.
 */
function StudioPlaceholder({ title, description }) {
  useStudioPage({
    title,
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: title },
    ],
  });

  return (
    <div className={styles.page}>
      <StudioEmptyState
        title={`${title} is on the way`}
        description={
          description ||
          "This chapter of Creator Studio will open in the next phase. The shelf is ready."
        }
        action={
          <Link to={STUDIO.DASHBOARD} className={styles.back}>
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}

export default StudioPlaceholder;

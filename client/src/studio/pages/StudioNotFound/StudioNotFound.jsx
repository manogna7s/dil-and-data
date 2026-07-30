import { Link } from "react-router-dom";
import { STUDIO } from "../../../constants";
import useStudioPage from "../../hooks/useStudioPage";
import StudioEmptyState from "../../components/StudioEmptyState/StudioEmptyState";
import styles from "./StudioNotFound.module.css";

function StudioNotFound() {
  useStudioPage({
    title: "Not found",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "404" },
    ],
  });

  return (
    <div className={styles.page}>
      <StudioEmptyState
        title="This page wandered off"
        description="The studio shelf you asked for isn’t here. Let’s return to the dashboard."
        action={
          <Link to={STUDIO.DASHBOARD} className={styles.cta}>
            Return to dashboard
          </Link>
        }
      />
    </div>
  );
}

export default StudioNotFound;

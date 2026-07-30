import { Navigate } from "react-router-dom";
import { useAuth } from "../../context";
import { STUDIO } from "../../constants";
import StudioLoader from "./StudioLoader/StudioLoader";

/**
 * Guest-only route — logged-in users skip login.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <StudioLoader label="Preparing your studio…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={STUDIO.DASHBOARD} replace />;
  }

  return children;
}

export default GuestRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context";
import { STUDIO } from "../../constants";
import StudioLoader from "./StudioLoader/StudioLoader";

/**
 * Protects Creator Studio routes — redirects guests to login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <StudioLoader label="Preparing your studio…" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={STUDIO.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;

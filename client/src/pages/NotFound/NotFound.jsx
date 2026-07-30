import { useNavigate } from "react-router-dom";
import { PageContainer, EmptyState } from "../../components";
import { ROUTES } from "../../constants";

function NotFound() {
  const navigate = useNavigate();

  return (
    <PageContainer size="md">
      <EmptyState
        title="404 — Page not found"
        description="This page wandered off the journal. Let's find our way back."
        actionLabel="Return home"
        onAction={() => navigate(ROUTES.HOME)}
      />
    </PageContainer>
  );
}

export default NotFound;

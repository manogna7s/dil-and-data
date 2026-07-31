import { useNavigate } from "react-router-dom";
import { Container, EmptyState, Logo } from "../../components";
import { ROUTES } from "../../constants";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Container size="sm" className={styles.inner}>
        <Logo size={40} to={null} className={styles.logo} />
        <EmptyState
          title="Lost in another chapter"
          description="The page wandered off into another chapter. Softly now, let's find our way home."
          actionLabel="Return home"
          onAction={() => navigate(ROUTES.HOME)}
        />
        <p className={styles.hint}>Error 404 · A blank page in the journal</p>
      </Container>
    </div>
  );
}

export default NotFound;

import { useNavigate } from "react-router-dom";
import styles from "./QuickActions.module.css";

function QuickActions({ actions = [] }) {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={styles.action}
          aria-label={action.label}
          onClick={() => navigate(action.to)}
        >
          <span className={styles.title}>{action.label}</span>
          <span className={styles.desc}>{action.description}</span>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;

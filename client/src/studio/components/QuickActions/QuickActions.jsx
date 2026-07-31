import { Link } from "react-router-dom";
import styles from "./QuickActions.module.css";

function QuickActions({ actions = [] }) {
  return (
    <div className={styles.grid}>
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.to}
          className={styles.action}
          aria-label={action.label}
        >
          <span className={styles.title}>{action.label}</span>
          <span className={styles.desc}>{action.description}</span>
        </Link>
      ))}
    </div>
  );
}

export default QuickActions;

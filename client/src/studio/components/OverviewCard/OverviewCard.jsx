import { useNavigate } from "react-router-dom";
import styles from "./OverviewCard.module.css";

function OverviewCard({ label, value, hint, to }) {
  const navigate = useNavigate();

  const inner = (
    <>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </>
  );

  if (to) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.clickable}`}
        onClick={() => navigate(to)}
      >
        {inner}
      </button>
    );
  }

  return <article className={styles.card}>{inner}</article>;
}

export default OverviewCard;

import { Link } from "react-router-dom";
import styles from "./OverviewCard.module.css";

function OverviewCard({ label, value, hint, to }) {
  const inner = (
    <>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.card} ${styles.clickable}`}>
        {inner}
      </Link>
    );
  }

  return <article className={styles.card}>{inner}</article>;
}

export default OverviewCard;

import { Link } from "react-router-dom";
import styles from "./CategoryCard.module.css";

/**
 * CategoryCard — soft surface tile linking to a category archive.
 */
function CategoryCard({ name, count, image, href, className = "" }) {
  return (
    <Link to={href} className={`${styles.card} ${className}`}>
      <div className={styles.media}>
        <img src={image} alt="" className={styles.image} loading="lazy" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {typeof count === "number" && (
          <p className={styles.count}>
            {count} {count === 1 ? "story" : "stories"}
          </p>
        )}
      </div>
    </Link>
  );
}

export default CategoryCard;

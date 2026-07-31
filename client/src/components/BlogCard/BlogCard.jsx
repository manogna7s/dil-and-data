import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import Card from "../Card/Card";
import styles from "./BlogCard.module.css";

/**
 * BlogCard — article teaser for indexes and related posts.
 */
function BlogCard({
  title,
  excerpt,
  image,
  category,
  date,
  slug,
  className = "",
}) {
  const href = `/blogs/${slug}`;

  return (
    <Card className={`${styles.card} ${className}`}>
      {image ? (
        <Link to={href} className={styles.mediaLink} tabIndex={-1} aria-hidden="true">
          <div className={styles.media}>
            <img src={image} alt="" className={styles.image} loading="lazy" />
          </div>
        </Link>
      ) : null}

      <div className={styles.body}>
        <div className={styles.meta}>
          {category && <Badge>{category}</Badge>}
          {date && <time className={styles.date}>{date}</time>}
        </div>

        <h3 className={styles.title}>
          <Link to={href}>{title}</Link>
        </h3>

        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

        <Link to={href} className={`link-underline ${styles.readMore}`}>
          Read more
        </Link>
      </div>
    </Card>
  );
}

export default BlogCard;

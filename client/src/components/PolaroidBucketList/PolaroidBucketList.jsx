import PolaroidFrame from "../PolaroidFrame/PolaroidFrame";
import styles from "./PolaroidBucketList.module.css";

/**
 * Bucket-list rows — polaroid left or right with heading + tagline beside.
 */
function PolaroidBucketList({ items = [] }) {
  const list = items.filter((item) => item?.image || item?.heading);

  if (!list.length) return null;

  return (
    <div className={styles.list}>
      {list.map((item, index) => {
        const align = item.align === "right" ? "right" : "left";
        return (
          <article
            key={`${item.heading}-${index}`}
            className={`${styles.row} ${styles[align]}`}
          >
            <div className={styles.mediaCol}>
              {item.image ? (
                <PolaroidFrame
                  src={item.image}
                  alt={item.alt || item.heading || ""}
                  floatDelay={index * 0.45}
                />
              ) : null}
            </div>
            <div className={styles.textCol}>
              {item.heading ? (
                <h2 className={styles.heading}>{item.heading}</h2>
              ) : null}
              {item.tagline ? (
                <p className={styles.tagline}>{item.tagline}</p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default PolaroidBucketList;

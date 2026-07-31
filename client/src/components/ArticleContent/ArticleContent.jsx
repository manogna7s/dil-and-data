import styles from "./ArticleContent.module.css";
import QuoteBlock from "../QuoteBlock/QuoteBlock";

/**
 * Renders TipTap HTML from Creator Studio, or legacy content blocks.
 */
function ArticleContent({ blocks = [], html = "" }) {
  if (html) {
    return (
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={styles.content}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={key}
                className={block.dropCap ? styles.dropCap : undefined}
              >
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2 key={key} id={block.id} className={styles.heading}>
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <QuoteBlock key={key} attribution={block.attribution}>
                {block.text}
              </QuoteBlock>
            );
          case "image":
            return (
              <figure key={key} className={styles.figure}>
                <img src={block.src} alt={block.alt || ""} loading="lazy" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "gallery":
            return (
              <div key={key} className={styles.gallery}>
                {block.images.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt || ""}
                    loading="lazy"
                  />
                ))}
              </div>
            );
          case "code":
            return (
              <pre key={key} className={styles.code}>
                <code>{block.code}</code>
              </pre>
            );
          case "video":
            return (
              <div
                key={key}
                className={styles.video}
                role="group"
                aria-label={block.title}
              >
                <img src={block.poster} alt="" loading="lazy" />
                <span className={styles.play} aria-hidden="true">
                  ▶
                </span>
                <p className={styles.videoLabel}>{block.title}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default ArticleContent;

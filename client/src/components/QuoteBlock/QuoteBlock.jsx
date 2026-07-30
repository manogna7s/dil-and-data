import styles from "./QuoteBlock.module.css";

/**
 * QuoteBlock — pull-quote / diary excerpt.
 * Feels like a handwritten margin note in a printed book.
 */
function QuoteBlock({ children, attribution, className = "" }) {
  return (
    <blockquote className={`${styles.quote} ${className}`}>
      <p className={styles.text}>{children}</p>
      {attribution && <cite className={styles.cite}>— {attribution}</cite>}
    </blockquote>
  );
}

export default QuoteBlock;

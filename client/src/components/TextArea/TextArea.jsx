import styles from "./TextArea.module.css";

/**
 * TextArea — multi-line editorial field for letters & contact notes.
 */
function TextArea({
  id,
  label,
  error,
  hint,
  rows = 5,
  className = "",
  ...rest
}) {
  const inputId = id || rest.name;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`${styles.textarea} ${error ? styles.hasError : ""}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextArea;

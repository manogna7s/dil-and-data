import styles from "./Input.module.css";

/**
 * Input — single-line editorial form field.
 * Soft surface, quiet borders, Cormorant type.
 */
function Input({
  id,
  label,
  type = "text",
  error,
  hint,
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
      <input
        id={inputId}
        type={type}
        className={`${styles.input} ${error ? styles.hasError : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...rest}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;

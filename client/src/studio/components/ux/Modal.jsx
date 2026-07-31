import styles from "./Modal.module.css";

/**
 * Dark-overlay modal shell — classic journal frame, not a card stack.
 */
function Modal({
  open,
  title,
  onClose,
  children,
  wide = false,
  footer,
}) {
  if (!open) return null;

  return (
    <div className={styles.scrim} role="presentation" onClick={onClose}>
      <div
        className={`${styles.panel} ${wide ? styles.wide : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.bar}>
          <h2>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            Close
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}

export default Modal;

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ConfirmDialog.module.css";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setState({
        title: options.title || "Please confirm",
        message: options.message || "Are you sure?",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        tone: options.tone || "default",
      });
    });
  }, []);

  function close(result) {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  }

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state && (
        <div className={styles.scrim} role="presentation">
          <div
            className={styles.dialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="studio-confirm-title"
            aria-describedby="studio-confirm-desc"
          >
            <h2 id="studio-confirm-title" className={styles.title}>
              {state.title}
            </h2>
            <p id="studio-confirm-desc" className={styles.message}>
              {state.message}
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => close(false)}
              >
                {state.cancelLabel}
              </button>
              <button
                type="button"
                className={`${styles.confirm} ${state.tone === "danger" ? styles.danger : ""}`}
                onClick={() => close(true)}
                autoFocus
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

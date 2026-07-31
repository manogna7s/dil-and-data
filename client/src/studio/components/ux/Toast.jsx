import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, { tone = "default", duration = 3200 } = {}) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, tone }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      push,
      success: (message, opts) => push(message, { ...opts, tone: "success" }),
      error: (message, opts) => push(message, { ...opts, tone: "error", duration: 5000 }),
      info: (message, opts) => push(message, { ...opts, tone: "info" }),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.tone] || ""}`}
            role="status"
          >
            <span>{toast.message}</span>
            <button
              type="button"
              className={styles.close}
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

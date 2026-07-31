import { useEffect } from "react";

/**
 * Warn before leaving with unsaved edits (browser + optional callback).
 */
export function useUnsavedWarning(isDirty) {
  useEffect(() => {
    function onBeforeUnload(e) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);
}

/**
 * Studio keyboard shortcuts helper.
 * shortcuts: { "ctrl+s": fn, "meta+s": fn, "escape": fn }
 */
export function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    function onKey(e) {
      const key = e.key.toLowerCase();
      const parts = [];
      if (e.ctrlKey || e.metaKey) parts.push(e.metaKey ? "meta" : "ctrl");
      if (e.shiftKey) parts.push("shift");
      parts.push(key);
      const combo = parts.join("+");
      const alt = e.metaKey ? combo.replace("meta", "ctrl") : combo.replace("ctrl", "meta");

      const handler = shortcuts[combo] || shortcuts[alt] || shortcuts[key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts, enabled]);
}

export default { useUnsavedWarning, useKeyboardShortcuts };

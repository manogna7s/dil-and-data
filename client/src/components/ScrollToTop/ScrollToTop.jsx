import { useEffect, useState } from "react";
import { IconButton } from "../Button/Button";
import styles from "./ScrollToTop.module.css";

/**
 * ScrollToTop — appears after scrolling; returns to page top calmly.
 */
function ScrollToTop({ threshold = 400, className = "" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <div className={`${styles.wrap} ${className}`}>
      <IconButton
        label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={styles.button}
      >
        ↑
      </IconButton>
    </div>
  );
}

export default ScrollToTop;

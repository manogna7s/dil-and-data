import styles from "./BlinkingEyes.module.css";

/** Hero background — ornate frame artwork. */
function BlinkingEyes() {
  return (
    <div className={styles.field} aria-hidden="true">
      <img
        className={styles.art}
        src="/hero-frame.png"
        srcSet="/hero-frame.png 1x, /hero-frame-2x.webp 2x"
        alt=""
        width={1024}
        height={576}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default BlinkingEyes;

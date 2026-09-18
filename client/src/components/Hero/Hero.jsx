import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import {
  fetchFeaturedContent,
  fetchRecentContent,
  toCardProps,
} from "../../blocks/fetchLive";
import { optimizeImageUrl } from "../../utils/optimizeImage.js";
import styles from "./Hero.module.css";

const CLOSED_SRC = "/dabba-closed.png?v=solid";
const OPEN_SRC = "/dabba-open.png?v=solid";

/* Latest-blog polaroids sit on the photo stack inside the tray */
const POLAROID_LAYOUT = [
  { top: "28%", left: "16%", rotate: -8, z: 5, w: "20%" },
  { top: "25%", left: "34%", rotate: 6, z: 6, w: "18%" },
  { top: "46%", left: "18%", rotate: 5, z: 5, w: "18%" },
  { top: "44%", left: "35%", rotate: -4, z: 6, w: "19%" },
];

/**
 * Interactive memory-box hero — closed lid first, opens to the chest
 * with latest-blog polaroids. Branding is baked into the closed artwork.
 */
function Hero({ ctaTo = ROUTES.BLOGS }) {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [posts, setPosts] = useState([]);
  const labelId = useId();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featured, recent] = await Promise.all([
          fetchFeaturedContent(3).catch(() => []),
          fetchRecentContent(8).catch(() => []),
        ]);
        const seen = new Set();
        const merged = [];
        for (const item of [...(featured || []), ...(recent || [])]) {
          const card = toCardProps(item);
          if (!card?.slug || seen.has(card.slug)) continue;
          if (!card.coverImage && !card.image) continue;
          seen.add(card.slug);
          merged.push(card);
          if (merged.length >= 4) break;
        }
        if (!cancelled) setPosts(merged);
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleOpen() {
    if (open || opening) return;
    setOpening(true);
    window.setTimeout(() => {
      setOpen(true);
      setOpening(false);
    }, 520);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  }

  const polaroids = posts.slice(0, POLAROID_LAYOUT.length);

  return (
    <section
      className={`${styles.hero} ${open ? styles.isOpen : ""} ${opening ? styles.isOpening : ""}`}
      aria-label="Welcome"
    >
      <div className={styles.stage}>
        <div
          className={styles.closed}
          role={open ? undefined : "button"}
          tabIndex={open ? -1 : 0}
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-controls={`${labelId}-open`}
          onClick={open ? undefined : handleOpen}
          onKeyDown={open ? undefined : onKeyDown}
        >
          <span className={styles.groundShadow} aria-hidden="true" />
          <img
            className={`${styles.dabbaImg} ${styles.dabbaClosed}`}
            src={CLOSED_SRC}
            alt="Shakti's Blog — दिल & DATA"
            width={1000}
            height={656}
            draggable={false}
            fetchPriority="high"
            decoding="async"
          />
          <span id={labelId} className={styles.srOnly}>
            Shakti&apos;s Blog, Dil and Data. Tap to open.
          </span>
          <p className={styles.tapHint} aria-hidden="true">
            <span className={styles.tapArrow}>↑</span>
            <span className={styles.tapLabel}>tap to open</span>
          </p>
        </div>

        <div
          className={styles.open}
          id={`${labelId}-open`}
          aria-hidden={!open}
        >
          <div className={styles.openFrame}>
            <span className={styles.groundShadow} aria-hidden="true" />
            <img
              className={`${styles.dabbaImg} ${styles.dabbaOpen}`}
              src={OPEN_SRC}
              alt="Open memory chest"
              width={1000}
              height={839}
              draggable={false}
              decoding="async"
            />
            <div className={styles.tray}>
              {polaroids.map((post, i) => {
                const layout = POLAROID_LAYOUT[i] || POLAROID_LAYOUT[0];
                const src = optimizeImageUrl(post.coverImage || post.image, {
                  width: 480,
                  height: 480,
                });
                return (
                  <Link
                    key={post.id || post.slug}
                    to={`/blogs/${post.slug}`}
                    className={styles.polaroid}
                    style={{
                      top: layout.top,
                      left: layout.left,
                      width: layout.w,
                      zIndex: layout.z,
                      "--tilt": `${layout.rotate}deg`,
                    }}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className={styles.polaroidPhoto}>
                      <img src={src} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className={styles.polaroidCaption}>
                      {post.title}
                    </span>
                  </Link>
                );
              })}
              <Link
                to={ctaTo || ROUTES.BLOGS}
                className={styles.invite}
                tabIndex={open ? 0 : -1}
              >
                Come In. I Have Things to Say.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

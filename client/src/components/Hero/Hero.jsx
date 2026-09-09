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

const CLOSED_SRC = "/dabba-closed.png";
const OPEN_SRC = "/dabba-open.png";

/* Polaroid positions — more gap, especially in bottom tray */
const POLAROID_LAYOUT = [
  { top: "8%", left: "16%", rotate: -6, z: 3, w: "36%" },
  { top: "12%", left: "48%", rotate: 7, z: 4, w: "34%" },
  { top: "58%", left: "12%", rotate: 4, z: 5, w: "34%" },
  { top: "62%", left: "50%", rotate: -5, z: 6, w: "34%" },
];

/* Mini desi scraps — tighter cluster around edges, slightly larger */
const DABBA_SCRAPS = [
  { src: "/dabba-scraps/pani-puri.png", top: "4%", left: "3%", w: "14%", rotate: -14, z: 2 },
  { src: "/dabba-scraps/cutting-chai.png", top: "3%", left: "76%", w: "16%", rotate: 10, z: 2 },
  { src: "/dabba-scraps/jhumkas.png", top: "24%", left: "1%", w: "15%", rotate: -6, z: 3 },
  { src: "/dabba-scraps/star-anise.png", top: "34%", left: "84%", w: "13%", rotate: 16, z: 2 },
  { src: "/dabba-scraps/laddu.png", top: "42%", left: "3%", w: "14%", rotate: 8, z: 2 },
  { src: "/dabba-scraps/mango.png", top: "46%", left: "85%", w: "13%", rotate: -10, z: 2 },
  { src: "/dabba-scraps/gajra.png", top: "76%", left: "2%", w: "15%", rotate: 12, z: 2 },
  { src: "/dabba-scraps/paisley.png", top: "80%", left: "80%", w: "16%", rotate: -14, z: 2 },
  { src: "/dabba-scraps/namaste-girl.png", top: "20%", left: "86%", w: "13%", rotate: 4, z: 3 },
  { src: "/dabba-scraps/pani-plate.png", top: "84%", left: "55%", w: "18%", rotate: 6, z: 2 },
  { src: "/dabba-scraps/floral-border.png", top: "1%", left: "28%", w: "36%", rotate: -2, z: 1 },
  { src: "/dabba-scraps/heart-locket.png", top: "38%", left: "78%", w: "15%", rotate: -8, z: 3 },
  { src: "/dabba-scraps/sunflower.png", top: "72%", left: "78%", w: "15%", rotate: 11, z: 2 },
  { src: "/dabba-scraps/rose-emoji.png", top: "68%", left: "4%", w: "14%", rotate: -7, z: 3 },
];

function ScrapObjects() {
  return (
    <div className={styles.scraps} aria-hidden="true">
      {DABBA_SCRAPS.map((item) => (
        <img
          key={item.src}
          className={styles.scrapImg}
          src={item.src}
          alt=""
          draggable={false}
          decoding="async"
          style={{
            top: item.top,
            left: item.left,
            width: item.w,
            zIndex: item.z,
            transform: `rotate(${item.rotate}deg)`,
          }}
        />
      ))}
      <span
        className={`${styles.scrap} ${styles.ticket}`}
        style={{ top: "12%", left: "58%", transform: "rotate(14deg)" }}
      >
        ticket · 2005
      </span>
      <span
        className={`${styles.scrap} ${styles.note}`}
        style={{ top: "70%", left: "18%", transform: "rotate(-8deg)" }}
      >
        keep
      </span>
      <span
        className={`${styles.scrap} ${styles.letter}`}
        style={{ top: "40%", left: "72%", transform: "rotate(-12deg)" }}
      >
        <span className={styles.letterFold} />
      </span>
    </div>
  );
}

/**
 * Interactive desi dabba hero — closed lid first, opens to polaroid memories.
 * Scoped to the homepage hero block only.
 * Lid copy is fixed to the dabba concept (CMS props intentionally unused for lid text).
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
        {/* Closed dabba */}
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
          <img
            className={styles.dabbaImg}
            src={CLOSED_SRC}
            alt=""
            width={650}
            height={438}
            draggable={false}
            fetchPriority="high"
            decoding="async"
          />
          <div className={styles.lidCopy} id={labelId}>
            <p className={styles.lidEyebrow}>Shakti&apos;s Blog</p>
            <h1 className={styles.lidTitle} aria-label="DIL & DATA">
              <span className={styles.dil}>दिल</span>
              <span className={styles.amp}>&</span>
              <span className={styles.data}>DATA</span>
            </h1>
            <p className={styles.lidTagline}>
              The Everything Journal of a Slightly Strange Girl.
            </p>
          </div>
          <p className={styles.tapHint} aria-hidden="true">
            <span className={styles.tapArrow}>↑</span>
            <span className={styles.tapLabel}>tap to open</span>
          </p>
        </div>

        {/* Open dabba + contents */}
        <div
          className={styles.open}
          id={`${labelId}-open`}
          aria-hidden={!open}
        >
          <div className={styles.openFrame}>
            <img
              className={styles.dabbaImg}
              src={OPEN_SRC}
              alt=""
              width={543}
              height={658}
              draggable={false}
              decoding="async"
            />
            <div className={styles.tray}>
              <ScrapObjects />
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

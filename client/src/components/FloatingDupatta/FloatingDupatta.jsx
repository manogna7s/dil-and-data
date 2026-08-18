import { useEffect, useId, useRef } from "react";
import dupattaSrc from "../../assets/dupatta.png";
import styles from "./FloatingDupatta.module.css";

const SPARKLES = [
  { top: "28%", left: "22%", delay: "0s", size: 5 },
  { top: "36%", left: "38%", delay: "0.8s", size: 3 },
  { top: "24%", left: "54%", delay: "1.6s", size: 4 },
  { top: "42%", left: "67%", delay: "0.4s", size: 3 },
  { top: "31%", left: "78%", delay: "1.2s", size: 6 },
  { top: "48%", left: "31%", delay: "2s", size: 3 },
  { top: "22%", left: "46%", delay: "2.4s", size: 4 },
  { top: "40%", left: "86%", delay: "1.1s", size: 3 },
  { top: "34%", left: "14%", delay: "1.8s", size: 4 },
  { top: "52%", left: "58%", delay: "0.6s", size: 3 },
];

/**
 * Dupatta stays in place; only the fabric flutters in the wind.
 */
function FloatingDupatta() {
  const rawId = useId().replace(/:/g, "");
  const filterId = `dupatta-wave-${rawId}`;
  const offsetRef = useRef(null);

  useEffect(() => {
    const offsetNode = offsetRef.current;
    if (!offsetNode) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let raf = 0;
    const tick = (now) => {
      const t = now * 0.0016;
      offsetNode.setAttribute("dx", (Math.sin(t) * 28).toFixed(2));
      offsetNode.setAttribute("dy", (Math.cos(t * 1.1) * 12).toFixed(2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <svg className={styles.canvas} viewBox="0 0 1024 455" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.03"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feOffset ref={offsetRef} in="noise" dx="0" dy="0" result="wind" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="wind"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="18"
              result="inner"
            />
            <feComposite
              in="SourceAlpha"
              in2="inner"
              operator="out"
              result="edge"
            />
            <feComposite
              in="SourceGraphic"
              in2="inner"
              operator="in"
              result="stillCenter"
            />
            <feComposite
              in="rippled"
              in2="edge"
              operator="in"
              result="movingEdge"
            />
            <feMerge>
              <feMergeNode in="stillCenter" />
              <feMergeNode in="movingEdge" />
            </feMerge>
          </filter>
        </defs>
        <image
          href={dupattaSrc}
          x="0"
          y="0"
          width="1024"
          height="455"
          filter={`url(#${filterId})`}
        />
      </svg>

      <div className={styles.sparkles}>
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className={styles.sparkle}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FloatingDupatta;

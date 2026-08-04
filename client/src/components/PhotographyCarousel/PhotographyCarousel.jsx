import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "../Button/Button";
import Container from "../Container/Container";
import Section from "../Section/Section";
import SectionTitle from "../SectionTitle/SectionTitle";
import styles from "./PhotographyCarousel.module.css";

/**
 * PhotographyCarousel — slow autoplay cinematic gallery.
 * photos[] will later come from GET /api/photography.
 */
function PhotographyCarousel({ photos = [], interval = 6000, tone = "surface" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);

  const count = photos.length;
  const current = photos[index];

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => clearInterval(id);
  }, [paused, count, interval]);

  if (!count) return null;

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  }

  return (
    <Section tone={tone} className={styles.section}>
      <Container size="xl">
        <div className={styles.header}>
          <SectionTitle>Through the lens</SectionTitle>
          <p className={styles.sub}>
            Slow frames from mountains, monsoon light, and quiet tables.
          </p>
        </div>

        <div
          className={styles.stage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.frame} aria-live="polite">
            <img
              key={current.id}
              src={current.src}
              alt={current.alt}
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.caption}>
              <p className={styles.captionTitle}>{current.title}</p>
              <p className={styles.captionLoc}>{current.location}</p>
            </div>
          </div>

          <div className={styles.controls}>
            <IconButton label="Previous photograph" onClick={prev}>
              ‹
            </IconButton>
            <div className={styles.dots} role="tablist" aria-label="Slides">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${photo.title}`}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <IconButton label="Next photograph" onClick={next}>
              ›
            </IconButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default PhotographyCarousel;

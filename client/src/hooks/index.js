import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants";

/**
 * useMediaQuery — subscribe to a CSS media query.
 * Useful for responsive behavior without duplicating breakpoint logic.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md}px)`);
}

/**
 * useBodyScrollLock — lock page scroll (mobile menus, modals).
 */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

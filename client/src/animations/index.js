/**
 * Animation helpers — keep motion tokens discoverable from JS if needed.
 */

export const MOTION = {
  duration: {
    fast: 180,
    base: 320,
    slow: 520,
    slower: 800,
  },
  ease: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    soft: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

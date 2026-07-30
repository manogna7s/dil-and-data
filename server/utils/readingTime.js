/**
 * Estimate reading time in minutes from plain text / HTML-ish body.
 * ~200 wpm — editorial average.
 */
export function calculateReadingTime(body) {
  const text = String(body || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return 1;

  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default calculateReadingTime;

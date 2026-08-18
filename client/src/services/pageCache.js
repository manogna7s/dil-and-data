const PREFIX = "dil_page_v1_";

export function readPageCache(slug) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${slug}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data || null;
  } catch {
    return null;
  }
}

export function writePageCache(slug, data) {
  try {
    localStorage.setItem(
      `${PREFIX}${slug}`,
      JSON.stringify({ data, at: Date.now() })
    );
  } catch {
    /* quota / private mode */
  }
}

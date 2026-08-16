/**
 * Insert Cloudinary delivery transforms so cards/covers aren't full-resolution.
 */
export function optimizeImageUrl(url, { width = 800, height } = {}) {
  if (!url || typeof url !== "string") return url;
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const head = url.slice(0, idx + marker.length);
  const tail = url.slice(idx + marker.length);
  const firstSeg = tail.split("/")[0] || "";

  if (firstSeg.includes("_") && !/^v\d+$/.test(firstSeg)) {
    return url;
  }

  const parts = ["f_auto", "q_auto", `w_${Math.round(width)}`];
  if (height) {
    parts.push(`h_${Math.round(height)}`, "c_fill");
  }
  return `${head}${parts.join(",")}/${tail}`;
}

export function optimizeHtmlImages(html, width = 1200) {
  if (!html) return html;
  return html.replace(
    /(<img\b[^>]*?\bsrc=")([^"]+)(")/gi,
    (_, open, src, close) => `${open}${optimizeImageUrl(src, { width })}${close}`
  );
}

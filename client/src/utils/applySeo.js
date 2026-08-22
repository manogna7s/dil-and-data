/**
 * Apply document title + meta tags for SEO / Open Graph / Twitter.
 * Used by public pages after settings or page-specific SEO load.
 */

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function normalizeBase(url = "") {
  const trimmed = String(url).trim().replace(/\/$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildTitle(title, siteName) {
  if (!title) return siteName || "DIL & DATA";
  if (siteName && !title.includes(siteName)) {
    return `${title} · ${siteName}`;
  }
  return title;
}

/**
 * @param {object} opts
 * @param {string} [opts.title]
 * @param {string} [opts.description]
 * @param {string} [opts.image]
 * @param {string} [opts.canonical]
 * @param {string} [opts.canonicalBase]
 * @param {string} [opts.path] — pathname for canonical when base is set
 * @param {string} [opts.ogTitle]
 * @param {string} [opts.ogDescription]
 * @param {string} [opts.ogImage]
 * @param {string} [opts.robots]
 * @param {string} [opts.twitterCard]
 * @param {string} [opts.siteName]
 */
export function applySeo(opts = {}) {
  const siteName = opts.siteName || "DIL & DATA";
  const title = opts.title || siteName;
  document.title = buildTitle(title, siteName.includes("·") ? null : siteName);

  const description = opts.description || "";
  if (description) upsertMeta("name", "description", description);

  const robots = opts.robots || "index, follow";
  upsertMeta("name", "robots", robots);

  const ogTitle = opts.ogTitle || title;
  const ogDescription = opts.ogDescription || description;
  const ogImage = opts.ogImage || opts.image || "";

  if (ogTitle) upsertMeta("property", "og:title", ogTitle);
  if (ogDescription) upsertMeta("property", "og:description", ogDescription);
  if (ogImage) upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", siteName);

  const twitterCard = opts.twitterCard || "summary_large_image";
  upsertMeta("name", "twitter:card", twitterCard);
  if (ogTitle) upsertMeta("name", "twitter:title", ogTitle);
  if (ogDescription) upsertMeta("name", "twitter:description", ogDescription);
  if (ogImage) upsertMeta("name", "twitter:image", ogImage);

  const base = normalizeBase(opts.canonicalBase);
  const canonical =
    opts.canonical || (base && opts.path != null ? `${base}${opts.path}` : base || "");
  if (canonical) upsertLink("canonical", canonical);
}

/** Map API settings → applySeo options for site-wide defaults. */
export function seoFromSettings(settings, { path } = {}) {
  const seo = settings?.seoDefaults || {};
  const siteName = settings?.siteName || "DIL & DATA";
  return {
    siteName,
    title: seo.title || siteName,
    description: seo.description || settings?.tagline || "",
    image: seo.ogImage || seo.image || "",
    canonicalBase: seo.canonicalBase,
    path,
    ogTitle: seo.ogTitle || seo.title || siteName,
    ogDescription: seo.ogDescription || seo.description || settings?.tagline || "",
    ogImage: seo.ogImage || seo.image || "",
    robots: seo.robots || "index, follow",
    twitterCard: seo.twitterCard || "summary_large_image",
  };
}

export default applySeo;

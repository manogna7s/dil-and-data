/**
 * Apply document title + meta tags for SEO / Open Graph / Twitter.
 */

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
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

export function normalizeBase(url = "") {
  const trimmed = String(url).trim().replace(/\/$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildTitle(title, siteName) {
  if (!title) return siteName || "DIL & DATA";
  if (siteName && title.includes(siteName)) return title;
  if (siteName) return `${title} | ${siteName}`;
  return title;
}

/**
 * @param {object} opts
 */
export function applySeo(opts = {}) {
  const siteName = opts.siteName || "DIL & DATA";
  const title = opts.title || siteName;
  document.title = buildTitle(title, siteName.includes("|") || siteName.includes("·") ? null : siteName);

  const description = opts.description || "";
  if (description) upsertMeta("name", "description", description);

  const robots = opts.robots || "index, follow";
  upsertMeta("name", "robots", robots);

  const base = normalizeBase(opts.canonicalBase) || "https://www.dilanddata.in";
  const path = opts.path != null ? opts.path : "";
  const canonical =
    opts.canonical ||
    (path === "/" || path === "" ? `${base}/` : `${base}${path.startsWith("/") ? path : `/${path}`}`);

  if (canonical) {
    upsertLink("canonical", canonical);
    upsertMeta("property", "og:url", canonical);
  }

  const ogTitle = opts.ogTitle || title;
  const ogDescription = opts.ogDescription || description;
  const ogImage = opts.ogImage || opts.image || "";
  const ogType = opts.ogType || "website";

  if (ogTitle) upsertMeta("property", "og:title", ogTitle);
  if (ogDescription) upsertMeta("property", "og:description", ogDescription);
  if (ogImage) upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:site_name", siteName);

  if (ogType === "article") {
    if (opts.publishedTime) {
      upsertMeta("property", "article:published_time", opts.publishedTime);
    }
    if (opts.modifiedTime) {
      upsertMeta("property", "article:modified_time", opts.modifiedTime);
    }
    if (opts.authorName) {
      upsertMeta("property", "article:author", opts.authorName);
    }
    if (opts.section) {
      upsertMeta("property", "article:section", opts.section);
    }
  }

  const twitterCard = opts.twitterCard || "summary_large_image";
  upsertMeta("name", "twitter:card", twitterCard);
  if (ogTitle) upsertMeta("name", "twitter:title", ogTitle);
  if (ogDescription) upsertMeta("name", "twitter:description", ogDescription);
  if (ogImage) upsertMeta("name", "twitter:image", ogImage);

  upsertMeta("name", "theme-color", "#f7f2ef");
}

/** Map API settings → applySeo options for site-wide defaults. */
export function seoFromSettings(settings, { path } = {}) {
  const seo = settings?.seoDefaults || {};
  const siteName = settings?.siteName || "DIL & DATA";
  return {
    siteName,
    title: seo.title || `${siteName} | Stories, Travel, Culture & Ideas`,
    description:
      seo.description ||
      "DIL & DATA is an independent personal publication exploring stories, travel, culture, books, people, and the quietly ridiculous details of everyday life.",
    image: seo.ogImage || seo.image || "",
    canonicalBase: seo.canonicalBase || "https://www.dilanddata.in",
    path,
    ogTitle: seo.ogTitle || seo.title || siteName,
    ogDescription:
      seo.ogDescription ||
      seo.description ||
      "An independent personal publication of stories, travel, culture, and curious everyday life.",
    ogImage: seo.ogImage || seo.image || "",
    robots: seo.robots || "index, follow",
    twitterCard: seo.twitterCard || "summary_large_image",
    ogType: "website",
  };
}

export default applySeo;

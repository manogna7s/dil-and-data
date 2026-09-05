import Page from "../models/Page.js";
import Content from "../models/Content.js";
import Category from "../models/Category.js";
import { getSettings } from "./settings.service.js";

/** Ensure absolute https origin — Google rejects bare hosts in sitemaps. */
function normalizeOrigin(value = "") {
  const trimmed = String(value || "").trim().replace(/\/$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, "");
  return `https://${trimmed}`;
}

function siteBase(settings) {
  return (
    normalizeOrigin(settings.seoDefaults?.canonicalBase) ||
    normalizeOrigin(process.env.CLIENT_URL) ||
    "https://www.dilanddata.in"
  );
}

function isoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function buildRobotsTxt() {
  const settings = await getSettings();
  const site = siteBase(settings);
  // Canonical root path — Vercel rewrites /sitemap.xml → API.
  const sitemapUrl = `${site}/sitemap.xml`;
  const robots = settings.seoDefaults?.robots || "index, follow";
  const disallow = robots.includes("noindex")
    ? "Disallow: /\n"
    : "Disallow: /studio\nDisallow: /studio/\n";

  return [
    "User-agent: *",
    disallow.trimEnd(),
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");
}

/**
 * Build sitemap entries with optional lastmod.
 * @returns {Promise<Array<{ loc: string, lastmod?: string }>>}
 */
async function collectUrls(settings) {
  const base = siteBase(settings);
  /** @type {Map<string, string|undefined>} */
  const map = new Map();

  function add(loc, lastmod) {
    if (!loc) return;
    const prev = map.get(loc);
    if (!prev || (lastmod && (!prev || lastmod > prev))) {
      map.set(loc, lastmod || prev);
    } else if (!map.has(loc)) {
      map.set(loc, lastmod);
    }
  }

  add(`${base}/`);
  add(`${base}/blogs`);
  add(`${base}/categories`);
  add(`${base}/contact`);
  add(`${base}/about`);

  if (settings.sitemap?.includePages !== false) {
    const pages = await Page.find({ status: "published" }).select("slug updatedAt");
    for (const page of pages) {
      const loc = page.slug === "home" ? `${base}/` : `${base}/${page.slug}`;
      add(loc, isoDate(page.updatedAt));
    }
  }

  const categories = await Category.find({ isActive: { $ne: false } }).select(
    "slug updatedAt"
  );
  for (const cat of categories) {
    if (!cat.slug) continue;
    add(`${base}/categories/${cat.slug}`, isoDate(cat.updatedAt));
  }

  if (settings.sitemap?.includeContent !== false) {
    const posts = await Content.find({ status: "published" }).select(
      "slug updatedAt publishedAt"
    );
    for (const post of posts) {
      add(
        `${base}/blogs/${post.slug}`,
        isoDate(post.updatedAt) || isoDate(post.publishedAt)
      );
    }
  }

  return [...map.entries()].map(([loc, lastmod]) => ({ loc, lastmod }));
}

export async function buildSitemapXml() {
  const settings = await getSettings();
  if (settings.sitemap?.enabled === false) {
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  }

  const entries = await collectUrls(settings);
  const body = entries
    .map(({ loc, lastmod }) => {
      const lm = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
      return `  <url><loc>${escapeXml(loc)}</loc>${lm}<changefreq>weekly</changefreq></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default { buildRobotsTxt, buildSitemapXml };

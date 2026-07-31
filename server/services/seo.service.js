import Page from "../models/Page.js";
import Content from "../models/Content.js";
import { getSettings } from "./settings.service.js";

function siteBase(settings) {
  const fromSeo = settings.seoDefaults?.canonicalBase?.replace(/\/$/, "");
  return fromSeo || process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:5173";
}

function apiBase(settings) {
  const explicit = process.env.API_PUBLIC_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  // Prefer client origin + /api only when API is reverse-proxied under the same host.
  const fromSeo = settings.seoDefaults?.canonicalBase?.replace(/\/$/, "");
  if (fromSeo && process.env.SEO_SITEMAP_ON_CLIENT === "true") {
    return `${fromSeo}/api`;
  }
  return (
    process.env.API_PUBLIC_URL?.replace(/\/$/, "") ||
    process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "") ||
    `http://localhost:${process.env.PORT || 5050}/api`
  );
}

export async function buildRobotsTxt() {
  const settings = await getSettings();
  const api = apiBase(settings);
  const robots = settings.seoDefaults?.robots || "index, follow";
  const disallow = robots.includes("noindex") ? "Disallow: /\n" : "Disallow:\n";

  return [
    "User-agent: *",
    disallow.trimEnd(),
    `Sitemap: ${api}/seo/sitemap.xml`,
    "",
  ].join("\n");
}

export async function buildSitemapXml() {
  const settings = await getSettings();
  if (settings.sitemap?.enabled === false) {
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  }

  const base = siteBase(settings);
  const urls = [`${base}/`, `${base}/blogs`, `${base}/categories`, `${base}/contact`];

  if (settings.sitemap?.includePages !== false) {
    const pages = await Page.find({ status: "published" }).select("slug updatedAt");
    for (const page of pages) {
      urls.push(page.slug === "home" ? `${base}/` : `${base}/${page.slug}`);
    }
  }

  if (settings.sitemap?.includeContent !== false) {
    const posts = await Content.find({ status: "published" }).select("slug updatedAt");
    for (const post of posts) {
      urls.push(`${base}/blogs/${post.slug}`);
    }
  }

  const unique = [...new Set(urls)];
  const body = unique
    .map(
      (loc) => `  <url><loc>${escapeXml(loc)}</loc><changefreq>weekly</changefreq></url>`
    )
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

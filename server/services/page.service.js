import Page from "../models/Page.js";
import { AppError } from "../utils/AppError.js";
import { uniqueSlug } from "../utils/slug.js";
import {
  PAGE_BLOCK_TYPES,
  RESERVED_PAGE_SLUGS,
  defaultBlockData,
} from "../constants/pageBlocks.js";

function normalizeBlocks(blocks = []) {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((block) => block && PAGE_BLOCK_TYPES.includes(block.type))
    .map((block) => ({
      id: block.id || crypto.randomUUID(),
      type: block.type,
      enabled: block.enabled !== false,
      data: {
        ...defaultBlockData(block.type),
        ...(block.data && typeof block.data === "object" ? block.data : {}),
      },
    }));
}

function assertSlugAllowed(slug) {
  if (RESERVED_PAGE_SLUGS.includes(slug)) {
    throw new AppError(`Slug “${slug}” is reserved for system routes`, 400);
  }
}

export async function createPage(payload) {
  const title = String(payload.title || "").trim();
  if (!title) throw new AppError("Title is required", 400);

  const slug = await uniqueSlug(Page, payload.slug || title);
  assertSlugAllowed(slug);

  const page = await Page.create({
    title,
    slug,
    status: payload.status || "draft",
    showInNav: Boolean(payload.showInNav),
    navLabel: payload.navLabel || title,
    navOrder: Number(payload.navOrder) || 100,
    seo: payload.seo || {},
    blocks: normalizeBlocks(payload.blocks),
  });

  return page;
}

export async function updatePage(id, payload) {
  const page = await Page.findById(id);
  if (!page) throw new AppError("Page not found", 404);

  if (payload.title !== undefined) page.title = String(payload.title).trim();

  if (payload.slug !== undefined) {
    const slug = await uniqueSlug(Page, payload.slug, id);
    assertSlugAllowed(slug);
    page.slug = slug;
  }

  if (payload.status !== undefined) page.status = payload.status;
  if (payload.showInNav !== undefined) page.showInNav = Boolean(payload.showInNav);
  if (payload.navLabel !== undefined) page.navLabel = payload.navLabel;
  if (payload.navOrder !== undefined) page.navOrder = Number(payload.navOrder) || 100;
  if (payload.seo !== undefined) page.seo = { ...page.seo?.toObject?.() || page.seo, ...payload.seo };
  if (payload.blocks !== undefined) page.blocks = normalizeBlocks(payload.blocks);

  await page.save();
  return page;
}

export async function deletePage(id) {
  const page = await Page.findByIdAndDelete(id);
  if (!page) throw new AppError("Page not found", 404);
  return page;
}

export async function getPageById(id) {
  const page = await Page.findById(id);
  if (!page) throw new AppError("Page not found", 404);
  return page;
}

export async function getPageBySlug(slug, { publicOnly = true } = {}) {
  const filter = { slug };
  if (publicOnly) filter.status = "published";

  const page = await Page.findOne(filter);
  if (!page) throw new AppError("Page not found", 404);
  return page;
}

export async function listPages({ status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  return Page.find(filter).sort({ navOrder: 1, title: 1 });
}

export async function listNavPages() {
  return Page.find({ status: "published", showInNav: true })
    .sort({ navOrder: 1, title: 1 })
    .select("title slug navLabel navOrder");
}

export async function upsertPageBySlug(slug, payload) {
  const existing = await Page.findOne({ slug });
  if (existing) {
    return updatePage(existing._id, { ...payload, slug });
  }
  return createPage({ ...payload, slug });
}

/** Bypass reserved check for system CMS pages like home/about during seed */
export async function seedPage(payload) {
  const slug = String(payload.slug || "").toLowerCase().trim();
  if (!slug) throw new AppError("Slug is required", 400);

  const existing = await Page.findOne({ slug });
  const data = {
    title: payload.title,
    slug,
    status: payload.status || "published",
    showInNav: payload.showInNav !== false,
    navLabel: payload.navLabel || payload.title,
    navOrder: payload.navOrder ?? 100,
    seo: payload.seo || {},
    blocks: normalizeBlocks(payload.blocks),
  };

  if (existing) {
    Object.assign(existing, data);
    await existing.save();
    return existing;
  }

  return Page.create(data);
}

export default {
  createPage,
  updatePage,
  deletePage,
  getPageById,
  getPageBySlug,
  listPages,
  listNavPages,
  upsertPageBySlug,
  seedPage,
};

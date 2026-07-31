import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";
import { uniqueSlug } from "../utils/slug.js";
import { calculateReadingTime } from "../utils/readingTime.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build Mongo filter from public/admin query params.
 */
export function buildContentFilter(query = {}, { publicOnly = false } = {}) {
  const filter = {};

  if (publicOnly) {
    filter.status = "published";
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.featured === "true") filter.featured = true;
  if (query.featured === "false") filter.featured = false;
  if (query.author) filter.author = query.author;

  if (query.tag) {
    filter.tags = query.tag.toLowerCase();
  }

  if (query.tags) {
    const tags = String(query.tags)
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (tags.length) filter.tags = { $all: tags };
  }

  if (query.q || query.keyword) {
    const keyword = query.q || query.keyword;
    filter.$or = [
      { title: { $regex: escapeRegex(keyword), $options: "i" } },
      { excerpt: { $regex: escapeRegex(keyword), $options: "i" } },
      { tags: { $regex: escapeRegex(keyword), $options: "i" } },
    ];
  }

  return filter;
}

async function prepareContentPayload(payload, { authorId, existingId = null } = {}) {
  const data = { ...payload };

  if (data.title) {
    data.slug = await uniqueSlug(Content, data.slug || data.title, existingId);
  }

  if (typeof data.body === "string") {
    data.readingTime = calculateReadingTime(data.body);
  }

  if (Array.isArray(data.tags)) {
    data.tags = data.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  }

  if (authorId) data.author = authorId;

  if (data.seo && !data.seo.canonicalSlug && data.slug) {
    data.seo.canonicalSlug = data.slug;
  }

  return data;
}

export async function createContent(payload, authorId) {
  const data = await prepareContentPayload(payload, { authorId });

  if (data.status === "published" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  const doc = await Content.create(data);
  return Content.findById(doc._id).populate("author", "name email avatar").populate("category", "title slug");
}

export async function updateContent(id, payload) {
  const existing = await Content.findById(id);
  if (!existing) throw new AppError("Content not found", 404);

  const data = await prepareContentPayload(payload, { existingId: id });
  Object.assign(existing, data);
  await existing.save();

  return Content.findById(id).populate("author", "name email avatar").populate("category", "title slug");
}

export async function deleteContent(id) {
  const doc = await Content.findByIdAndDelete(id);
  if (!doc) throw new AppError("Content not found", 404);

  // Best-effort cleanup of related docs
  const Comment = (await import("../models/Comment.js")).default;
  const Like = (await import("../models/Like.js")).default;
  await Promise.all([
    Comment.deleteMany({ content: id }).catch(() => {}),
    Like.deleteMany({ content: id }).catch(() => {}),
  ]);

  return doc;
}

export async function publishContent(id) {
  const doc = await Content.findById(id);
  if (!doc) throw new AppError("Content not found", 404);

  doc.status = "published";
  doc.publishedAt = doc.publishedAt || new Date();
  await doc.save();

  return doc.populate([
    { path: "author", select: "name email avatar" },
    { path: "category", select: "title slug" },
  ]);
}

export async function saveDraft(id) {
  const doc = await Content.findById(id);
  if (!doc) throw new AppError("Content not found", 404);

  doc.status = "draft";
  await doc.save();

  return doc.populate([
    { path: "author", select: "name email avatar" },
    { path: "category", select: "title slug" },
  ]);
}

export async function getContentById(id) {
  const doc = await Content.findById(id)
    .populate("author", "name email avatar bio")
    .populate("category", "title slug description");

  if (!doc) throw new AppError("Content not found", 404);
  return doc;
}

export async function getContentBySlug(slug, { publicOnly = true } = {}) {
  // Promote due scheduled drafts before public lookup.
  if (publicOnly) {
    const { publishDueScheduledContent } = await import("./scheduler.service.js");
    await publishDueScheduledContent();
  }

  const filter = { slug };
  if (publicOnly) filter.status = "published";

  const doc = await Content.findOne(filter)
    .populate("author", "name email avatar bio")
    .populate("category", "title slug description");

  if (!doc) throw new AppError("Content not found", 404);

  if (publicOnly) {
    doc.views += 1;
    await doc.save({ validateBeforeSave: false });
  }

  return doc;
}

export async function listContent(query = {}, options = {}) {
  const filter = buildContentFilter(query, options);
  const { page, limit, skip } = getPagination(query);

  const sortMap = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { publishedAt: 1, createdAt: 1 },
    popular: { views: -1, likesCount: -1 },
    featured: { featured: -1, publishedAt: -1 },
  };
  const sort = sortMap[query.sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    Content.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar")
      .populate("category", "title slug"),
    Content.countDocuments(filter),
  ]);

  return {
    items,
    pagination: buildPaginationMeta({ total, page, limit }),
  };
}

export async function getFeaturedContent(limit = 6) {
  return Content.find({ status: "published", featured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", "name avatar")
    .populate("category", "title slug");
}

export async function getRecentContent(limit = 6) {
  return Content.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", "name avatar")
    .populate("category", "title slug");
}

export default {
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  saveDraft,
  getContentById,
  getContentBySlug,
  listContent,
  getFeaturedContent,
  getRecentContent,
};

import { apiRequest } from "./api.js";

/**
 * Content API — Creator Studio publishing desk.
 * Maps 1:1 to Phase 4 /api/content endpoints.
 */

export async function listAdminContent(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const result = await apiRequest(`/content/admin${suffix}`);
  return result.data;
}

/** Public published content (Shakti's Blog). */
export async function listPublicContent(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const result = await apiRequest(`/content${suffix}`, { auth: false });
  return result.data;
}

export async function getContentBySlug(slug) {
  const result = await apiRequest(`/content/slug/${encodeURIComponent(slug)}`, {
    auth: false,
  });
  return result.data;
}

export async function getContent(id) {
  const result = await apiRequest(`/content/${id}`);
  return result.data;
}

export async function createContent(payload) {
  const result = await apiRequest("/content", {
    method: "POST",
    body: payload,
  });
  return result.data;
}

export async function updateContent(id, payload) {
  const result = await apiRequest(`/content/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return result.data;
}

export async function deleteContent(id) {
  const result = await apiRequest(`/content/${id}`, { method: "DELETE" });
  return result.data;
}

export async function publishContent(id) {
  const result = await apiRequest(`/content/${id}/publish`, { method: "POST" });
  return result.data;
}

export async function draftContent(id) {
  const result = await apiRequest(`/content/${id}/draft`, { method: "POST" });
  return result.data;
}

export async function archiveContent(id) {
  return updateContent(id, { status: "archived" });
}

export async function duplicateContent(item) {
  const payload = {
    title: `${item.title} (Copy)`,
    excerpt: item.excerpt || "",
    body: item.body || "",
    coverImage: item.coverImage || "",
    gallery: item.gallery || [],
    videos: item.videos || [],
    type: item.type || "blog",
    category: item.category?._id || item.category || null,
    tags: item.tags || [],
    status: "draft",
    featured: false,
    seo: item.seo || {},
  };
  return createContent(payload);
}

export default {
  listAdminContent,
  listPublicContent,
  getContentBySlug,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  draftContent,
  archiveContent,
  duplicateContent,
};

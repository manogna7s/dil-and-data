import { apiRequest } from "./api.js";

export async function getPageBySlug(slug, { preview = false, signal } = {}) {
  if (preview) {
    const result = await apiRequest(`/pages/admin/slug/${slug}`, { signal });
    return result.data;
  }
  const result = await apiRequest(`/pages/slug/${slug}`, { auth: false, signal });
  return result.data;
}

export async function listNavPages() {
  const result = await apiRequest("/pages/nav", { auth: false });
  return result.data;
}

export async function listAdminPages(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query}` : "";
  const result = await apiRequest(`/pages/admin${suffix}`);
  return result.data;
}

export async function getAdminPage(id) {
  const result = await apiRequest(`/pages/admin/${id}`);
  return result.data;
}

export async function getBlockTypes() {
  const result = await apiRequest("/pages/admin/block-types");
  return result.data;
}

export async function createPage(payload) {
  const result = await apiRequest("/pages", { method: "POST", body: payload });
  return result.data;
}

export async function updatePage(id, payload) {
  const result = await apiRequest(`/pages/${id}`, { method: "PATCH", body: payload });
  return result.data;
}

export async function deletePage(id) {
  const result = await apiRequest(`/pages/${id}`, { method: "DELETE" });
  return result.data;
}

export default {
  getPageBySlug,
  listNavPages,
  listAdminPages,
  getAdminPage,
  getBlockTypes,
  createPage,
  updatePage,
  deletePage,
};

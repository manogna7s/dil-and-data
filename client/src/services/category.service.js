import { apiRequest } from "./api.js";

/** Categories for editor settings — public list includes counts. */
export async function listCategories() {
  const result = await apiRequest("/categories", { auth: true });
  return result.data;
}

export async function listPublicCategories() {
  const result = await apiRequest("/categories", { auth: false });
  return result.data;
}

export async function listAdminCategories() {
  const result = await apiRequest("/categories/admin");
  return result.data;
}

export async function createCategory(payload) {
  const result = await apiRequest("/categories", {
    method: "POST",
    body: payload,
  });
  return result.data;
}

export async function updateCategory(id, payload) {
  const result = await apiRequest(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return result.data;
}

export async function deleteCategory(id) {
  const result = await apiRequest(`/categories/${id}`, { method: "DELETE" });
  return result.data;
}

export default {
  listCategories,
  listPublicCategories,
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

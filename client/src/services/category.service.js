import { apiRequest } from "./api.js";

/** Categories for editor settings — public list includes counts. */
export async function listCategories() {
  const result = await apiRequest("/categories", { auth: true });
  return result.data;
}

export async function listAdminCategories() {
  const result = await apiRequest("/categories/admin");
  return result.data;
}

export default { listCategories, listAdminCategories };

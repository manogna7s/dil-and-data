import { apiRequest } from "./api.js";

export async function listPublicComments(contentId) {
  const result = await apiRequest(`/comments/content/${contentId}`, {
    auth: false,
  });
  return result.data;
}

export async function createComment(payload) {
  const result = await apiRequest("/comments", {
    method: "POST",
    body: payload,
    auth: false,
  });
  return result.data;
}

export async function listAdminComments(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const result = await apiRequest(`/comments/admin${suffix}`);
  return result.data;
}

export async function moderateComment(id, status) {
  const result = await apiRequest(`/comments/${id}/moderate`, {
    method: "PATCH",
    body: { status },
  });
  return result.data;
}

export async function deleteComment(id) {
  const result = await apiRequest(`/comments/${id}`, { method: "DELETE" });
  return result.data;
}

export async function bulkModerateComments(ids, status) {
  const result = await apiRequest("/comments/admin/bulk-moderate", {
    method: "POST",
    body: { ids, status },
  });
  return result.data;
}

export async function bulkDeleteComments(ids) {
  const result = await apiRequest("/comments/admin/bulk-delete", {
    method: "POST",
    body: { ids },
  });
  return result.data;
}

export async function replyToComment(id, body) {
  const result = await apiRequest(`/comments/${id}/reply`, {
    method: "POST",
    body: { body },
  });
  return result.data;
}

export default {
  listPublicComments,
  createComment,
  listAdminComments,
  moderateComment,
  deleteComment,
  bulkModerateComments,
  bulkDeleteComments,
  replyToComment,
};

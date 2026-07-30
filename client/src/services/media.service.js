import { API_BASE_URL, getStoredToken, ApiError } from "./api.js";

/**
 * Media library API — Cloudinary-backed Creator Studio assets.
 */

function authHeaders(extra = {}) {
  const headers = { Accept: "application/json", ...extra };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseJsonResponse(response) {
  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }
  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || "Request failed", {
      status: response.status,
      errors: payload?.errors,
      data: payload?.data,
    });
  }
  return payload;
}

export async function listMedia(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const result = await fetch(`${API_BASE_URL}/media${suffix}`, {
    headers: authHeaders(),
    credentials: "include",
  }).then(parseJsonResponse);
  return result.data;
}

export async function listFolders() {
  const result = await fetch(`${API_BASE_URL}/media/folders`, {
    headers: authHeaders(),
    credentials: "include",
  }).then(parseJsonResponse);
  return result.data;
}

export async function getMedia(id) {
  const result = await fetch(`${API_BASE_URL}/media/${id}`, {
    headers: authHeaders(),
    credentials: "include",
  }).then(parseJsonResponse);
  return result.data;
}

export async function updateMedia(id, payload) {
  const result = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  }).then(parseJsonResponse);
  return result.data;
}

export async function deleteMedia(id) {
  const result = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
    credentials: "include",
  }).then(parseJsonResponse);
  return result.data;
}

export async function bulkDeleteMedia(ids) {
  const result = await fetch(`${API_BASE_URL}/media/bulk-delete`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ ids }),
  }).then(parseJsonResponse);
  return result.data;
}

/**
 * Upload with progress via XHR (fetch cannot report upload %).
 * onProgress(percent 0–100)
 */
export function uploadMedia(file, { folder, alt, caption, title, onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    if (folder) form.append("folder", folder);
    if (alt) form.append("alt", alt);
    if (caption) form.append("caption", caption);
    if (title) form.append("title", title);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/media/upload`);
    xhr.withCredentials = true;

    const token = getStoredToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && payload.success !== false) {
          onProgress?.(100);
          resolve(payload.data);
          return;
        }
        reject(
          new ApiError(payload.message || "Upload failed", {
            status: xhr.status,
            errors: payload.errors,
          })
        );
      } catch (err) {
        reject(err);
      }
    };

    xhr.onerror = () => reject(new ApiError("Network error during upload", { status: 0 }));
    xhr.send(form);
  });
}

export function replaceMedia(id, file, { folder, alt, caption, title, onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    if (folder) form.append("folder", folder);
    if (alt) form.append("alt", alt);
    if (caption) form.append("caption", caption);
    if (title) form.append("title", title);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/media/${id}/replace`);
    xhr.withCredentials = true;

    const token = getStoredToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && payload.success !== false) {
          onProgress?.(100);
          resolve(payload.data);
          return;
        }
        reject(
          new ApiError(payload.message || "Replace failed", {
            status: xhr.status,
            errors: payload.errors,
          })
        );
      } catch (err) {
        reject(err);
      }
    };

    xhr.onerror = () => reject(new ApiError("Network error during replace", { status: 0 }));
    xhr.send(form);
  });
}

export async function uploadMany(files, options = {}) {
  const results = [];
  for (const file of files) {
    results.push(await uploadMedia(file, options));
  }
  return results;
}

export default {
  listMedia,
  listFolders,
  getMedia,
  updateMedia,
  deleteMedia,
  bulkDeleteMedia,
  uploadMedia,
  replaceMedia,
  uploadMany,
};

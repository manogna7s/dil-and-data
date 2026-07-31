import { apiRequest, API_BASE_URL, getStoredToken } from "./api.js";

export async function listSubscribers(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const result = await apiRequest(`/subscribers${suffix}`);
  return result.data;
}

export async function deleteSubscriber(id) {
  const result = await apiRequest(`/subscribers/${id}`, { method: "DELETE" });
  return result.data;
}

export async function exportSubscribersCsv(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : "";
  const headers = { Accept: "text/csv" };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/subscribers/export${suffix}`, {
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Could not export subscribers");
  }
  return response.text();
}

export default { listSubscribers, deleteSubscriber, exportSubscribersCsv };

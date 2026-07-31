import { apiRequest } from "./api.js";

export async function getSettings() {
  const result = await apiRequest("/settings", { auth: false });
  return result.data;
}

export async function updateSettings(payload) {
  const result = await apiRequest("/settings", {
    method: "PATCH",
    body: payload,
  });
  return result.data;
}

export default { getSettings, updateSettings };

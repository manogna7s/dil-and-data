import {
  apiRequest,
  storeAuthToken,
  clearAuthToken,
  getStoredToken,
} from "./api.js";

/**
 * Auth service — thin wrappers around Phase 4 /api/auth.
 */
export async function login({ email, password, rememberMe = false }) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });

  if (result?.data?.token) {
    storeAuthToken(result.data.token, rememberMe);
  }

  return result.data;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST", auth: false });
  } finally {
    clearAuthToken();
  }
}

export async function getProfile(options = {}) {
  const result = await apiRequest("/auth/profile", options);
  return result.data;
}

export function hasStoredSession() {
  return Boolean(getStoredToken());
}

export default { login, logout, getProfile, hasStoredSession };

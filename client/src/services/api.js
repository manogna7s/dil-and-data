/**
 * HTTP client — single abstraction over Phase 4 APIs.
 * Always sends cookies; attaches Bearer token when present.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const TOKEN_KEY = "dil_studio_token";
const REMEMBER_KEY = "dil_studio_remember";

export function getStoredToken() {
  const remember = localStorage.getItem(REMEMBER_KEY) === "true";
  if (remember) return localStorage.getItem(TOKEN_KEY);
  return sessionStorage.getItem(TOKEN_KEY);
}

export function storeAuthToken(token, rememberMe) {
  localStorage.setItem(REMEMBER_KEY, rememberMe ? "true" : "false");

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export class ApiError extends Error {
  constructor(message, { status, errors, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    signal,
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    credentials: "include",
    signal,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

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

export { API_BASE_URL };

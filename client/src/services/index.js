/* API service layer — all backend calls go through here (later phases) */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export { API_BASE_URL };

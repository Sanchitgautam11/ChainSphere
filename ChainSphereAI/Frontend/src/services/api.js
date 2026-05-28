import axios from "axios";

/**
 * Shared Axios instance pointing at the Node.js backend.
 * In development, Vite proxies /api → http://localhost:5000.
 * In production, set VITE_API_URL env var.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT token ──────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nexus_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to sign in
      localStorage.removeItem("nexus_token");
      localStorage.removeItem("nexus_user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;

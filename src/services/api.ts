// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api"                                   // dev: 프록시 경유
    : (import.meta.env.VITE_API_BASE_URL ?? "https://www.moamoas.com/api"), // prod
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const at =
    localStorage.getItem("accessToken") ??
    import.meta.env.VITE_TEMP_ACCESS_TOKEN;
  if (at) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${at}` };
  }
  return config;
});

export default api;

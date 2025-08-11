// src/lib/api.ts (또는 쓰는 axios 인스턴스 파일)
import axios from "axios";

const api = axios.create({
  baseURL: "https://www.moamoas.com/api", // ✅ 여기로 고정
  timeout: 8000,
  // withCredentials: false  // JSON 토큰이면 불필요
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

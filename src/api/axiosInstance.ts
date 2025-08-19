// src/api/axiosInstance.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const baseURL = "/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 8000,
});

// 부팅 시 기본 Authorization
if (typeof window !== "undefined") {
  const bootAT = window.localStorage.getItem("accessToken");
  if (bootAT) {
    (instance.defaults.headers as any).common = {
      ...(instance.defaults.headers as any).common,
      Authorization: `Bearer ${bootAT}`,
    };
  }
}

const AUTH_FREE_PREFIXES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/kakao",
  "/auth/kakao/callback",
];

/** 요청 인터셉터 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    // 0) URL에 /api 가 두 번 붙는 실수 방지
    // baseURL = "/api" 이므로, config.url이 "/api/..."로 오면 "/..."로 바꿈
    if (config.url?.startsWith("/api/")) {
      config.url = config.url.slice(4); // "/api" 제거
    } else if (config.url === "/api") {
      config.url = "/";
    }

    // 1) 헤더 래핑
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    // 2) 토큰 (화이트리스트 제외)
    const rawUrl = config.url || "";
    const logicalUrl = rawUrl.startsWith("/api/") ? rawUrl.slice(4) : rawUrl;
    if (!AUTH_FREE_PREFIXES.some((p) => logicalUrl.startsWith(p))) {
      if (typeof window !== "undefined") {
        const at = window.localStorage.getItem("accessToken");
        if (at) headers.set("Authorization", `Bearer ${at}`);
      }
    }

    // 3) Content-Type 자동화
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData) {
      // multipart는 브라우저가 boundary를 넣어야 함 → 직접 세팅 금지
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else {
      // JSON 바디일 때만 Content-Type 지정
      const method = (config.method || "get").toLowerCase();
      const hasBody = method === "post" || method === "put" || method === "patch";
      const isJsonLike =
        hasBody &&
        config.data &&
        typeof config.data === "object" &&
        !(config.data instanceof Blob) &&
        !(config.data instanceof ArrayBuffer);

      if (isJsonLike) {
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
      } else {
        // GET 등 바디 없는 요청은 굳이 지정하지 않음
        headers.delete("Content-Type");
      }
    }

    config.headers = headers;
    return config;
  } catch {
    return config;
  }
});

/** 응답 에러 로깅 */
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API ERROR]", {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export function saveTokens(accessToken?: string | null, refreshToken?: string | null) {
  if (typeof window !== "undefined") {
    if (accessToken) window.localStorage.setItem("accessToken", accessToken);
    if (refreshToken) window.localStorage.setItem("refreshToken", refreshToken);
  }
  if (accessToken) {
    (instance.defaults.headers as any).common = {
      ...(instance.defaults.headers as any).common,
      Authorization: `Bearer ${accessToken}`,
    };
  }
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
  }
  delete (instance.defaults.headers as any).common?.Authorization;
  delete (instance.defaults.headers as any).common?.authorization;
}

// GET 캐시 비활성화
const getDefaults = (instance.defaults.headers as any).get || {};
(getDefaults as any)["If-Modified-Since"] = "0";
(getDefaults as any)["Cache-Control"] = "no-cache";
(getDefaults as any)["Pragma"] = "no-cache";
(instance.defaults.headers as any).get = getDefaults;

export default instance;

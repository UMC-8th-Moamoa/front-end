// src/api/axiosInstance.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// dev, prod 모두 동일하게 같은 오리진으로만 호출
const baseURL = "/api";

const instance = axios.create({
  baseURL,
  withCredentials: true, // RT를 쿠키로 운용 중이면 유지
  timeout: 8000,
});

// ⛳️ 앱 부팅 시 localStorage에 AT가 있다면 기본 헤더에 미리 반영
if (typeof window !== "undefined") {
  const bootAT = window.localStorage.getItem("accessToken");
  if (bootAT) {
    (instance.defaults.headers as any).common = {
      ...(instance.defaults.headers as any).common,
      Authorization: `Bearer ${bootAT}`,
    };
  }
}

// 토큰을 붙이지 않을 경로(접두사 기준)
const AUTH_FREE_PREFIXES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/kakao",
  "/auth/kakao/callback",
];

/** 요청 인터셉터: AccessToken 자동 첨부 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const url = config.url || "";
    // 특정 경로는 토큰 미첨부
    if (AUTH_FREE_PREFIXES.some((p) => url.startsWith(p))) return config;

    if (typeof window === "undefined") return config; // SSR 가드
    const at = window.localStorage.getItem("accessToken");
    if (!at) return config;

    // Axios v1: AxiosHeaders 또는 POJO 모두 대응
    const headers = (config.headers ?? {}) as AxiosHeaders | Record<string, any>;
    if (headers instanceof AxiosHeaders) {
      headers.set("Authorization", `Bearer ${at}`);
    } else {
      headers["Authorization"] = `Bearer ${at}`;
    }
    config.headers = headers;
    return config;
  } catch {
    return config;
  }
});

/** (선택) 응답 에러 로깅 */
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

/** 로그인/회원가입 직후 토큰 저장 + 즉시 헤더 반영 */
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

/** 로그아웃 등 토큰 제거 */
export function clearTokens() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
  }
  // 다양한 케이스 대비해서 둘 다 제거
  delete (instance.defaults.headers as any).common?.Authorization;
  delete (instance.defaults.headers as any).common?.authorization;
}

/** GET 캐시 비활성화(ETag/If-Modified-Since 무시) */
const getDefaults = (instance.defaults.headers as any).get || {};
(getDefaults as any)["If-Modified-Since"] = "0";
(getDefaults as any)["Cache-Control"] = "no-cache";
(getDefaults as any)["Pragma"] = "no-cache";
(instance.defaults.headers as any).get = getDefaults;

export default instance;
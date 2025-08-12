import axios from "axios";

// dev: 프록시(/api), prod: 환경변수
const baseURL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL ?? "https://www.moamoas.com/api");

const instance = axios.create({
  baseURL,
  withCredentials: true, // RT를 쿠키로 운용하면 true 유지
  timeout: 8000,
});

/** 요청: AccessToken 자동 첨부 */
instance.interceptors.request.use((config) => {
  const at = localStorage.getItem("accessToken");
  if (at) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${at}` };
  }
  return config;
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
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (accessToken) {
    // 다음 요청에 즉시 반영
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}

/** 로그아웃 등 토큰 제거 */
export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete instance.defaults.headers.common.Authorization;
}

export default instance;

import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// dev, prod 모두 동일하게 같은 오리진으로만 호출
const baseURL = "/api";

const instance = axios.create({
  baseURL,
  withCredentials: true, // 쿠키 쓰면 유지, 아니면 false
  timeout: 8000,
});


/** 요청: AccessToken 자동 첨부 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const at = localStorage.getItem("accessToken");
  if (!at) return config;

  const headers = config.headers as AxiosHeaders | Record<string, any>;

  if (headers instanceof AxiosHeaders) {
    headers.set("Authorization", `Bearer ${at}`);
  } else {
    headers["Authorization"] = `Bearer ${at}`;
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
  localStorage.removeItem("my_user_id");
  delete instance.defaults.headers.common["Authorization"];
}

export default instance;

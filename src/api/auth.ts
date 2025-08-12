// src/api/auth.ts
import api, { saveTokens, clearTokens } from "./axiosInstance";

/** 공통 응답 래퍼 */
type ApiEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

type UserLite = { id: number; email?: string; user_id?: string; name: string };
type Tokens = { accessToken: string; refreshToken?: string };

type LoginSuccess = {
  user?: UserLite;
  tokens?: Tokens;
  accessToken?: string;
  refreshToken?: string;
};

type RegisterSuccess = { user: UserLite; tokens?: Tokens };
type SendEmailSuccess = { message: string };
type VerifyEmailSuccess = { verified: boolean; message: string };
type CheckNicknameSuccess = { available: boolean; message: string };
type FindIdSuccess = { user_id?: string; message?: string };

/** 래퍼/비래퍼 모두 대응하여 토큰 추출 */
function extractTokens(data: any): { accessToken?: string; refreshToken?: string } {
  const s = data?.success ?? data;
  return {
    accessToken: s?.tokens?.accessToken ?? s?.accessToken,
    refreshToken: s?.tokens?.refreshToken ?? s?.refreshToken,
  };
}

/** 서버 응답을 항상 ApiEnvelope<T>로 정규화 */
function normalizeEnvelope<T>(data: any): ApiEnvelope<T> {
  if (data && typeof data === "object" && "resultType" in data) {
    return data as ApiEnvelope<T>;
  }
  // 맨바디로 내려온 성공 응답을 SUCCESS 래퍼로 감싸기
  return {
    resultType: "SUCCESS",
    error: null,
    success: data as T,
  };
}

/** 1) 닉네임 중복 확인 (프록시 경유) */
export async function checkNicknameDuplicate(nickname: string, signal?: AbortSignal) {
  const res = await api.get<ApiEnvelope<CheckNicknameSuccess>>(
    `/auth/nickname/${nickname}/check`,
    { signal }
  );
  return res.data;
}

/** 2) 이메일 인증코드 전송 (프록시 경유) */
export async function sendEmailCode(email: string, purpose: "signup" | "reset") {
  const res = await api.post<ApiEnvelope<SendEmailSuccess>>(
    `/auth/email/verify-email`,
    { email, purpose }
  );
  return res.data;
}

/** 3) 이메일 인증코드 확인 (프록시 경유) */
export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: "signup" | "reset" = "signup"
) {
  const res = await api.post<ApiEnvelope<VerifyEmailSuccess>>(
    `/auth/email/send-code`,
    { email, code, purpose }
  );
  return res.data;
}

/** 4) 회원가입 (성공 시 토큰 저장) — 항상 ApiEnvelope로 반환 */
export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
  nickname: string;
  user_id: string; // 로그인용 ID
}): Promise<ApiEnvelope<RegisterSuccess>> {
  const res = await api.post<ApiEnvelope<RegisterSuccess> | RegisterSuccess>(
    `/auth/register`,
    payload
  );
  const normalized = normalizeEnvelope<RegisterSuccess>(res.data);

  // 토큰 저장 (성공 시)
  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);
  }

  return normalized;
}

/** 5) 로그인 (성공 시 토큰 저장) — 항상 ApiEnvelope로 반환 */
export async function loginUser(
  payload:
    | { user_id: string; password: string } // ID 로그인
    | { email: string; password: string }   // 이메일 로그인
): Promise<ApiEnvelope<LoginSuccess>> {
  const res = await api.post<ApiEnvelope<LoginSuccess> | LoginSuccess>(
    `/auth/login`,
    payload,
    { withCredentials: true } // RT를 쿠키로 운용한다면 필요
  );

  const normalized = normalizeEnvelope<LoginSuccess>(res.data);

  // 토큰 저장 (성공 시)
  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);
  }

  return normalized;
}

/** 6) 로그아웃 */
export async function logoutUser() {
  try {
    await api.post(`/auth/logout`).catch(() => void 0);
  } finally {
    clearTokens();
  }
}

/** 7) 아이디 찾기 */
export async function findUserId(email: string) {
  const res = await api.post<ApiEnvelope<FindIdSuccess>>(`/auth/find-id`, { email });
  return res.data;
}

/** 8) 비밀번호 변경 */
export async function resetPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await api.put<ApiEnvelope<{ message?: string }>>(
    `/auth/change-password`,
    payload
  );
  return res.data;
}
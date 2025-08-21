// src/api/auth.ts
import api, { saveTokens, clearTokens } from "./axiosInstance";
import { fetchMySelfInfo, setMyUserId } from "../services/mypage";

/** ---------- 공통 래퍼 & 타입 ---------- */
export type ApiEnvelope<T> = {
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

export type RegisterSuccess = { user: UserLite; tokens?: Tokens };
type SendEmailSuccess = { message: string; token?: string };
type VerifyEmailSuccess = { verified: boolean; message: string };
type CheckNicknameSuccess = { available: boolean; message: string };
type FindIdSuccess = { user_id?: string; message?: string };

/** ---------- 유틸: 토큰/래퍼 정규화 ---------- */
function extractTokens(data: any): { accessToken?: string; refreshToken?: string } {
  const s = data?.success ?? data;
  return {
    accessToken: s?.tokens?.accessToken ?? s?.accessToken,
    refreshToken: s?.tokens?.refreshToken ?? s?.refreshToken,
  };
}

function normalizeEnvelope<T>(data: any): ApiEnvelope<T> {
  if (data && typeof data === "object" && "resultType" in data) {
    return data as ApiEnvelope<T>;
  }
  return { resultType: "SUCCESS", error: null, success: data as T };
}

/* =========================================================================
   아이디(=user_id) 중복 확인
   - 백엔드 최신 스펙: GET /auth/user-id/{userId}/check
   - 호환 위해 기존 checkNicknameDuplicate 이름을 유지하고 내부에서 위 경로 사용
   ========================================================================= */

/** 내부: 아이디 중복 확인 */
export async function checkUserIdDuplicate(userId: string, signal?: AbortSignal) {
  const id = userId.trim();
  const path = `/auth/user-id/${encodeURIComponent(id)}/check`;
  const { data } = await api.get<ApiEnvelope<CheckNicknameSuccess>>(path, { signal });
  return data;
}

/** 호환 API: 닉네임 중복확인 → 실제로는 user_id 중복확인 호출 */
export async function checkNicknameDuplicate(nickname: string, signal?: AbortSignal) {
  return checkUserIdDuplicate(nickname, signal);
}

/* =========================================================================
   비밀번호 재설정 플로우(새 스펙)
   1) POST /auth/find-password        { email, purpose:'reset' }  → 코드/링크 발송
   2) POST /auth/verify-reset-code    { email, code, purpose:'reset' } → 코드 검증
   3) POST /auth/reset-password       { token, newPassword, confirmPassword }
   ========================================================================= */

/** (1) 재설정 코드/링크 발송 */
export async function sendPasswordResetCode(email: string) {
  const { data } = await api.post<ApiEnvelope<SendEmailSuccess>>(
    `/auth/find-password`,
    { email, purpose: "reset" }
  );
  return data;
}

/** (2) 재설정 코드 검증 */
export async function verifyPasswordResetCode(email: string, code: string) {
  const { data } = await api.post<ApiEnvelope<VerifyEmailSuccess>>(
    `/auth/verify-reset-code`,
    { email, code, purpose: "reset" }
  );
  return data;
}

/** (3) 최종 비밀번호 재설정 (토큰 기반) */
export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { data } = await api.post<ApiEnvelope<{ message?: string }>>(
    `/auth/reset-password`,
    payload
  );
  return data;
}

/* =========================================================================
   회원가입용 이메일 인증(구 플로우) — 그대로 유지
   /auth/email/verify-email  (전송)
   /auth/email/send-code     (검증)
   ========================================================================= */
export async function sendEmailCode(
  email: string,
  purpose: "signup" | "reset" = "signup"
) {
  const res = await api.post<ApiEnvelope<SendEmailSuccess>>(
    `/auth/email/verify-email`,
    { email, purpose }
  );
  return res.data;
}

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

/* =========================================================================
   회원가입 / 로그인 / 로그아웃
   ========================================================================= */

/** 회원가입 (성공 시 토큰 저장) */
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

  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);
  }
  return normalized;
}

/** 로그인 (성공 시 토큰 저장 및 my_user_id 저장) */
export async function loginUser(
  payload:
    | { user_id: string; password: string } // ID 로그인
    | { email: string; password: string }   // 이메일 로그인
): Promise<ApiEnvelope<LoginSuccess>> {
  const res = await api.post<ApiEnvelope<LoginSuccess> | LoginSuccess>(
    `/auth/login`,
    payload,
    { withCredentials: true }
  );

  const normalized = normalizeEnvelope<LoginSuccess>(res.data);

  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);

    const uidFromRes = normalized.success.user?.user_id;
    const uidFromPayload = "user_id" in payload ? (payload as any).user_id : "";
    const resolvedUid = (uidFromRes || uidFromPayload || "").trim();
    if (resolvedUid) setMyUserId(resolvedUid);
  }
  return normalized;
}

/** 로그아웃 (항상 토큰 정리) */
export async function logoutUser() {
  try {
    await api.post(`/auth/logout`).catch(() => void 0);
  } finally {
    clearTokens();
  }
}

/** 아이디 찾기 */
export async function findUserId(email: string) {
  const res = await api.post<ApiEnvelope<FindIdSuccess>>(`/auth/find-id`, { email });
  return res.data;
}

/* =========================================================================
   로그인 → 프로필 부트스트랩
   ========================================================================= */
export type BootstrapResult = {
  accessToken?: string;
  refreshToken?: string;
  user_id: string;
  profile?: {
    userId: string;
    name: string;
    birthday: string;
    followers: number;
    following: number;
    image: string;
  };
};

export async function loginAndBootstrapProfile(
  payload:
    | { user_id: string; password: string }
    | { email: string; password: string }
): Promise<BootstrapResult> {
  // 1) 로그인
  const loginRes = await loginUser(payload);
  if (loginRes.resultType !== "SUCCESS" || !loginRes.success) {
    throw new Error((loginRes as any)?.error?.reason ?? "LOGIN_FAILED");
  }

  // 2) 토큰 추출
  const { accessToken, refreshToken } = extractTokens(loginRes);

  // 3) user_id 확정
  let uid =
    loginRes.success.user?.user_id ||
    (("user_id" in payload) ? (payload as any).user_id : "");

  if (!uid && "email" in payload) {
    const found = await findUserId(payload.email);
    uid = found?.success?.user_id || "";
  }
  if (!uid) throw new Error("CANNOT_RESOLVE_USER_ID");

  // 4) 로컬 저장
  setMyUserId(uid);

  // 5) 마이페이지 프로필
  const me = await fetchMySelfInfo(uid);
  const profile = me?.success?.profile;

  return { accessToken, refreshToken, user_id: uid, profile };
}
// src/api/auth.ts
import api, { saveTokens, clearTokens } from "./axiosInstance";
import { fetchMySelfInfo, setMyUserId } from "../services/mypage";

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

export type RegisterSuccess = { user: UserLite; tokens?: Tokens };
type SendEmailSuccess = { message: string; token?: string };
type VerifyEmailSuccess = { verified: boolean; message: string };
type CheckNicknameSuccess = { available: boolean; message: string };
type FindIdSuccess = { user_id?: string; message?: string };

/* -------------------------------------------
   유틸: 토큰 추출 & 래퍼 정규화
------------------------------------------- */
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

/* -------------------------------------------
   닉네임/아이디 중복 확인
------------------------------------------- */
export async function checkNicknameDuplicate(nickname: string, signal?: AbortSignal) {
  return checkUserIdDuplicate(nickname, signal);
}

export async function checkUserIdDuplicate(userId: string, signal?: AbortSignal) {
  const id = userId.trim();
  const path = `/auth/user-id/${encodeURIComponent(id)}/check`;

  const req = async () =>
    api.get<ApiEnvelope<CheckNicknameSuccess>>(path, {
      signal,
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      params: { _t: Date.now() }, // 캐시 버스터
      validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
    });

  try {
    let res = await req();
    if (res.status === 304 || !res.data) res = await req();
    return res.data;
  } catch (e: any) {
    console.error("[USERID CHECK ERROR]", {
      url: path,
      status: e?.response?.status,
      data: e?.response?.data,
    });
    throw e;
  }
}

/* -------------------------------------------
   비밀번호 재설정(비로그인 플로우)
   1) 코드 전송      POST /auth/find-password { email, purpose:'reset' }
   2) 코드 검증      POST /auth/verify-reset-code { email, code, purpose:'reset' }
   3) 최종 변경      POST /auth/reset-password { token, newPassword, confirmPassword }
------------------------------------------- */
export async function sendPasswordResetCode(email: string) {
  const { data } = await api.post<ApiEnvelope<SendEmailSuccess>>("/auth/find-password", {
    email,
    purpose: "reset",
  });
  return data;
}

export async function verifyPasswordResetCode(email: string, code: string) {
  const { data } = await api.post<ApiEnvelope<VerifyEmailSuccess>>("/auth/verify-reset-code", {
    email,
    code,
    purpose: "reset",
  });
  return data;
}

// ⛳️ 이름 분리: 토큰 기반 재설정
export async function resetPasswordWithToken(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { data } = await api.post<ApiEnvelope<{ message?: string }>>(
    "/auth/reset-password",
    payload
  );
  return data;
}

/* -------------------------------------------
   회원가입용 이메일 인증
------------------------------------------- */
export async function sendEmailCode(email: string, purpose: "signup" | "reset") {
  const res = await api.post<ApiEnvelope<SendEmailSuccess>>("/auth/email/verify-email", {
    email,
    purpose,
  });
  return res.data;
}

export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: "signup" | "reset" = "signup"
) {
  const res = await api.post<ApiEnvelope<VerifyEmailSuccess>>("/auth/email/send-code", {
    email,
    code,
    purpose,
  });
  return res.data;
}

/* -------------------------------------------
   회원가입 / 로그인 / 로그아웃
------------------------------------------- */
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
    "/auth/register",
    payload
  );
  const normalized = normalizeEnvelope<RegisterSuccess>(res.data);

  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);
  }
  return normalized;
}

export async function loginUser(
  payload: { user_id: string; password: string } | { email: string; password: string }
): Promise<ApiEnvelope<LoginSuccess>> {
  const res = await api.post<ApiEnvelope<LoginSuccess> | LoginSuccess>(
    "/auth/login",
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

    const numericId = normalized.success.user?.id;
    if (numericId) localStorage.setItem("my_numeric_id", String(numericId));
  }
  return normalized;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout").catch(() => void 0);
  } finally {
    clearTokens();
  }
}

/* -------------------------------------------
   아이디 찾기
------------------------------------------- */
export async function findUserId(email: string) {
  const res = await api.post<ApiEnvelope<FindIdSuccess>>("/auth/find-id", { email });
  return res.data;
}

/* -------------------------------------------
   로그인 상태 비밀번호 변경 (마이페이지 등)
   ⛳️ 이름 분리: changePassword
------------------------------------------- */
export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await api.put<ApiEnvelope<{ message?: string }>>(
    "/auth/change-password",
    payload
  );
  return res.data;
}

/* -------------------------------------------
   로그인 + 프로필 부트스트랩
------------------------------------------- */
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
  payload: { user_id: string; password: string } | { email: string; password: string }
): Promise<BootstrapResult> {
  const loginRes = await loginUser(payload);
  if (loginRes.resultType !== "SUCCESS" || !loginRes.success) {
    throw new Error((loginRes as any)?.error?.reason ?? "LOGIN_FAILED");
  }

  const { accessToken, refreshToken } = extractTokens(loginRes);

  let uid =
    loginRes.success.user?.user_id ||
    (("user_id" in payload) ? (payload as any).user_id : "");

  if (!uid && "email" in payload) {
    const found = await findUserId(payload.email);
    uid = found?.success?.user_id || "";
  }
  if (!uid) throw new Error("CANNOT_RESOLVE_USER_ID");

  setMyUserId(uid);

  const numericId = loginRes.success.user?.id;
  if (numericId) localStorage.setItem("my_numeric_id", String(numericId));

  const me = await fetchMySelfInfo(uid);
  const profile = me?.success?.profile;

  return { accessToken, refreshToken, user_id: uid, profile };
}
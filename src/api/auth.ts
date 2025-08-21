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

/** ---------- 닉네임 중복 확인 ---------- */
export async function checkNicknameDuplicate(nickname: string, signal?: AbortSignal) {
  return checkUserIdDuplicate(nickname, signal);
}

/** ---------- 아이디 중복 확인 ---------- */
export async function checkUserIdDuplicate(userId: string, signal?: AbortSignal) {
  const id = userId.trim();
  const path = `/auth/user-id/${encodeURIComponent(id)}/check`;

  // 요청 함수: 캐시 회피 헤더 + 쿼리스트링 버스터
  const req = async () => {
    return axiosProxy.get(path, {
      signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      params: { _t: Date.now() },             // 캐시 버스터
      validateStatus: s => (s >= 200 && s < 300) || s === 304, // 304도 일단 통과
    });
  };

  try {
    let res = await req();

    // 혹시 304로 바디가 비었으면 한 번 더 강제 버스터로 재시도
    if (res.status === 304 || !res.data) {
      res = await req();
    }

    return res.data; // { resultType, success: { available: boolean } } 기대
  } catch (e: any) {
    console.error('[USERID CHECK ERROR]', {
      url: path,
      status: e?.response?.status,
      data: e?.response?.data,
    });
    throw e;
  }
}

/** (1) 비밀번호 재설정 코드 전송 */
export async function sendPasswordResetCode(email: string) {
  const { data } = await axiosProxy.post('/api/auth/find-password', {
    email,
    purpose: 'reset',
  });
  return data as ApiEnvelope<SendEmailSuccess>;
}

/** (2) 비밀번호 재설정 코드 검증 */
export async function verifyPasswordResetCode(email: string, code: string) {
  const { data } = await axiosProxy.post('/api/auth/verify-reset-code', {
    email,
    code,
    purpose: 'reset',
  });
  return data as ApiEnvelope<VerifyEmailSuccess>;
}

/** (3) 비밀번호 재설정 최종 */
export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { data } = await axiosProxy.post('/api/auth/reset-password', payload);
  return data as ApiEnvelope<{ message?: string }>;
}

/** 2) 이메일 인증코드 전송 (프록시 경유) */
export async function sendEmailCode(email: string, purpose: "signup" | "reset") {
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

  // 토큰 저장 (성공 시)
  if (normalized.resultType === "SUCCESS" && normalized.success) {
    const { accessToken, refreshToken } = extractTokens(normalized);
    if (accessToken) saveTokens(accessToken, refreshToken ?? null);
  }

  return normalized;
}

/** 5) 로그인 (성공 시 토큰 저장) — 항상 ApiEnvelope로 반환
 *  - ✅ 가능하면 이 단계에서 my_user_id를 먼저 저장 (이후 화면에서 즉시 사용)
 */
export async function loginUser(
  payload:
    | { user_id: string; password: string } // ID 로그인
    | { email: string; password: string }   // 이메일 로그인
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

    // 기존 로직: 문자열 user_id 저장 (화면 표시용)
    const uidFromRes = normalized.success.user?.user_id;
    const uidFromPayload = "user_id" in payload ? (payload as any).user_id : "";
    const resolvedUid = (uidFromRes || uidFromPayload || "").trim();
    if (resolvedUid) {
      console.log("[DEBUG] Auth: Setting my_user_id (string) to:", resolvedUid);
      setMyUserId(resolvedUid);
    }

    // ==================== SOLUTION ====================
    // CHANGED: 숫자 ID를 별도로 localStorage에 저장 (API 호출용)
 const numericId = normalized.success.user?.id;   // 👈 로그인 응답의 숫자 PK
if (numericId) {
  localStorage.setItem("my_numeric_id", String(numericId));
  console.log('[DEBUG] user from login', normalized.success?.user);

}
    // ================================================
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

// =========================
// 9) 로그인 + 프로필 부트스트랩
// =========================
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
  const loginRes = await loginUser(payload);
  if (loginRes.resultType !== "SUCCESS" || !loginRes.success) {
    throw new Error(
      (loginRes as any)?.error?.reason ?? "LOGIN_FAILED"
    );
  }

  const { accessToken, refreshToken } = extractTokens(loginRes);

  // 3) user_id 확정 전략
  //    - 응답에 user?.user_id 있으면 그거 사용
  //    - payload가 ID 로그인이라면 payload.user_id
  //    - (선택) 이메일 로그인 케이스는 별도 아이디 조회 API가 있다면 호출
   let uid =
    loginRes.success.user?.user_id ||
    (("user_id" in payload) ? (payload as any).user_id : "");

  if (!uid && "email" in payload) {
    const found = await findUserId(payload.email);
    uid = found?.success?.user_id || "";
  }
  if (!uid) {
    throw new Error("CANNOT_RESOLVE_USER_ID");
  }
  
  // 기존 로직: 문자열 ID 저장
  console.log("[DEBUG] Auth (Bootstrap): Setting my_user_id (string) to:", uid);
  setMyUserId(uid);

  // ==================== SOLUTION ====================
  // CHANGED: 숫자 ID도 함께 저장
  const numericId = loginRes.success.user?.id;
  if (numericId) {
    console.log("[DEBUG] Auth (Bootstrap): Setting my_numeric_id (number) to:", numericId);
    localStorage.setItem('my_numeric_id', String(numericId));
  }
  // ================================================

  const me = await fetchMySelfInfo(uid);
  const profile = me?.success?.profile;

  return {
    accessToken,
    refreshToken,
    user_id: uid,
    profile,
  };
}
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

/** 5) 로그인 (성공 시 토큰 저장) — 항상 ApiEnvelope로 반환
 *  - ✅ 가능하면 이 단계에서 my_user_id를 먼저 저장 (이후 화면에서 즉시 사용)
 */
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

  //  user_id 저장
  const uidFromRes = normalized.success.user?.user_id;
  const uidFromPayload = "user_id" in payload ? (payload as any).user_id : "";
  const resolvedUid = (uidFromRes || uidFromPayload || "").trim();
  if (resolvedUid) setMyUserId(resolvedUid);
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

/** 로그인 → 토큰 저장 → user_id 확정 → my_user_id 저장 → 프로필 즉시 조회 */
export async function loginAndBootstrapProfile(
  payload:
    | { user_id: string; password: string }
    | { email: string; password: string }
): Promise<BootstrapResult> {
  // 1) 로그인
  const loginRes = await loginUser(payload);
  if (loginRes.resultType !== "SUCCESS" || !loginRes.success) {
    throw new Error(
      (loginRes as any)?.error?.reason ?? "LOGIN_FAILED"
    );
  }

  // 2) 토큰 추출 (saveTokens에서 이미 저장했지만 반환도 함께)
  const { accessToken, refreshToken } = extractTokens(loginRes);

  // 3) user_id 확정 전략
  //    - 응답에 user?.user_id 있으면 그거 사용
  //    - payload가 ID 로그인이라면 payload.user_id
  //    - (선택) 이메일 로그인 케이스는 별도 아이디 조회 API가 있다면 호출
  let uid =
    loginRes.success.user?.user_id ||
    (("user_id" in payload) ? (payload as any).user_id : "");

  // 이메일 로그인인데 서버가 user_id를 안 내려준 경우에만 보조 API 사용
  if (!uid && "email" in payload) {
    const found = await findUserId(payload.email);
    uid = found?.success?.user_id || "";
  }
  if (!uid) {
    throw new Error("CANNOT_RESOLVE_USER_ID");
  }

  // 4) 로컬 저장: 이후 화면에서 공통 사용
  setMyUserId(uid);

  // 5) 마이페이지 프로필 즉시 조회
  const me = await fetchMySelfInfo(uid);
  const profile = me?.success?.profile;

  return {
    accessToken,
    refreshToken,
    user_id: uid,
    profile,
  };
}

import axiosProxy from './axiosInstance';

type ApiEnvelope<T> = {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

type CheckNicknameSuccess = { available: boolean; message: string };
type SendEmailSuccess = { message: string; token?: string };
type VerifyEmailSuccess = { verified: boolean; message: string };
type RegisterSuccess = {
  user: { id: number; email: string; name: string };
  tokens?: { accessToken: string; refreshToken: string };
};
type FindIdSuccess = {
  user_id?: string;
  message?: string;
};

/** ---------- 닉네임 중복 확인 ---------- */
export async function checkNicknameDuplicate(nickname: string, signal?: AbortSignal) {
  return checkUserIdDuplicate(nickname, signal);
}

/** ---------- 아이디 중복 확인 ---------- */
export async function checkUserIdDuplicate(
  userId: string,
  signal?: AbortSignal
) {
  const id = userId.trim();                 // 백엔드가 대소문자 구분하면 toLowerCase() 하지 마세요
  const path = `/auth/user-id/${encodeURIComponent(id)}/check`;
  try {
    const { data } = await axiosProxy.get(path, { signal });
    return data; // { resultType, success: { available: boolean } } 기대
  } catch (e: any) {
    console.error('[USERID CHECK ERROR]', {
      url: path,
      status: e?.response?.status,
      data: e?.response?.data,             // <- 백엔드에 reason 전달
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

/** ---------- 회원가입: 이메일 인증 ---------- */
export async function sendEmailCode(
  email: string,
  purpose: 'signup' | 'reset' = 'signup'
): Promise<ApiEnvelope<SendEmailSuccess>> {
  const res = await axiosProxy.post<ApiEnvelope<SendEmailSuccess>>(
    '/api/auth/email/verify-email',
    { email, purpose }
  );
  return res.data;
}

export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: 'signup' | 'reset' = 'signup'
): Promise<ApiEnvelope<VerifyEmailSuccess>> {
  const res = await axiosProxy.post<ApiEnvelope<VerifyEmailSuccess>>(
    '/api/auth/email/send-code',
    { email, code, purpose }
  );
  return res.data;
}

/** ---------- 회원가입 ---------- */
export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
  nickname: string;
  user_id: string;
}): Promise<ApiEnvelope<RegisterSuccess>> {
  try {
    const res = await axiosProxy.post('/api/auth/register', payload);
    return res.data;
  } catch (err: any) {
    console.error('[REGISTER ERROR]', {
      url: err.config?.url,
      payload: err.config?.data,
      status: err.response?.status,
      data: err.response?.data,
    });
    throw err;
  }
}

/** ---------- 아이디 찾기 ---------- */
export async function findUserId(email: string) {
  const res = await axiosProxy.post<ApiEnvelope<FindIdSuccess>>('/api/auth/find-id', { email });
  return res.data;
}
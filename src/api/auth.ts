// src/api/auth.ts
import axiosProxy from './axiosInstance'; // 프록시(/api)용 인스턴스
import axios from 'axios';

// 인증 도메인(절대 URL)
const AUTH_BASE = 'https://www.moamoas.com/api';

// ===== 공통 타입 =====
type ApiEnvelope<T> = {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

type CheckNicknameSuccess = { available: boolean; message: string };
type SendEmailSuccess = { message: string };
type VerifyEmailSuccess = { verified: boolean; message: string };
type RegisterSuccess = {
  user: { id: number; email: string; name: string };
  tokens?: { accessToken: string; refreshToken: string };
};

// 1) 아이디(닉네임) 중복 확인 — 프록시 사용
//    (선택) AbortController 신호 지원
export async function checkNicknameDuplicate(
  nickname: string,
  signal?: AbortSignal
): Promise<ApiEnvelope<CheckNicknameSuccess>> {
  const res = await axiosProxy.get(`/auth/nickname/${nickname}/check`, { signal });
  return res.data;
}

// 2) 이메일 인증코드 전송 — 현재 쿠키 불필요(임시)
export async function sendEmailCode(
  email: string,
  purpose: 'signup' | 'reset'
): Promise<ApiEnvelope<SendEmailSuccess>> {
  const res = await axios.post<ApiEnvelope<SendEmailSuccess>>(
    `${AUTH_BASE}/auth/email/verify-email`,
    { email, purpose },
    { withCredentials: false }
  );
  return res.data;
}

// 3) 이메일 인증코드 확인
const SEND_CODE_CREDENTIALS = false;

export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: 'signup' | 'reset' = 'signup'
): Promise<ApiEnvelope<VerifyEmailSuccess>> {
  const res = await axios.post<ApiEnvelope<VerifyEmailSuccess>>(
    `${AUTH_BASE}/auth/email/send-code`,
    { email, code, purpose },
    { withCredentials: SEND_CODE_CREDENTIALS }
  );
  return res.data;
}

// 4) 회원가입 — 프록시 사용
export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
  nickname: string;
  user_id: string; // 로그인용 ID (임시: nickname과 동일)
}): Promise<ApiEnvelope<RegisterSuccess>> {
  try {
    const res = await axiosProxy.post('/auth/register', payload);
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
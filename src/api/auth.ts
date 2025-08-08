// src/api/auth.ts
import axios from './axiosInstance';

// 공통 응답 Envelope 타입
type ApiEnvelope<T> = {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | {
    errorCode: string;
    reason?: string | null;
    data?: unknown;
  };
  success: T | null;
};

type CheckNicknameSuccess = {
  available: boolean;
  message: string;
};

type SendEmailSuccess = {
  message: string; // 예: '인증코드 6자리가 이메일로 전송되었습니다.'
};

type VerifyEmailSuccess = {
  verified: boolean; // true면 검증 성공
  message: string;
};

type RegisterSuccess = {
  user: { id: number; email: string; name: string };
  tokens?: { accessToken: string; refreshToken: string };
};

// 1) 아이디(닉네임) 중복 확인
export async function checkNicknameDuplicate(
  nickname: string
): Promise<ApiEnvelope<CheckNicknameSuccess>> {
  const res = await axios.get(`/auth/nickname/${nickname}/check`);
  return res.data;
}

// 2) 이메일 인증코드 전송 (=> { email, purpose })
export async function sendEmailCode(
  email: string,
  purpose: 'signup' | 'reset'
): Promise<ApiEnvelope<SendEmailSuccess>> {
  const res = await axios.post('/auth/email/verify-email', {
    email,
    purpose,
  });
  return res.data;
}

// 3) 이메일 인증코드 확인 (=> { email, code, purpose })
export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: 'signup' | 'reset' = 'signup'
): Promise<ApiEnvelope<VerifyEmailSuccess>> {
  const res = await axios.post('/auth/email/send-code', { email, code, purpose });
  return res.data;
}

// 4) 회원가입
export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
}): Promise<ApiEnvelope<RegisterSuccess>> {
  const res = await axios.post('/auth/register', payload);
  return res.data;
}
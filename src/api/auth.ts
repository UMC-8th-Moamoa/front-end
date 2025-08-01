import axios from 'axios'; 

export async function registerUser(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("서버 오류");
  }

  return res.json();
}

// 아이디(닉네임) 중복 확인
export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axios.get(`/api/users/nickname/${nickname}/check`);
  return res.data;
};

// 이메일 인증코드 전송
export const sendEmailCode = async (email: string) => {
  const res = await axios.post('/api/auth/verify-email', { email });
  return res.data;
};

// 이메일 인증코드 확인
export const verifyEmailCode = async (email: string, verificationCode: string) => {
  const res = await axios.post('/api/auth/email/send-id', {
  email,
  verificationCode,
});
  return res.data;
};
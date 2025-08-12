// src/api/axiosInstance.ts
import axios from 'axios';

// 환경별 baseURL 설정
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 전송 필요시 true
});

// 요청/응답 로깅 (선택)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export default instance;
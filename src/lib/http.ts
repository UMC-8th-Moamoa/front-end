// src/lib/http.ts
// axios 단일 인스턴스 + 헤더 기반 토큰 + 401 한 번 재시도
const rt = localStorage.getItem('refreshToken');
if (!USE_COOKIES && !rt) throw new Error('NO_REFRESH_TOKEN');

import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'

// 개발에서는 프록시(/api) 타고, 배포에서는 환경변수 우선
const API_BASE_URL =
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_BASE_URL || '/api') // ex) https://www.moamoas.com/api
    : '/api'

// 지금은 헤더 기반으로 단순화 (쿠키 기반이면 서버 CORS 열릴 때 다시 true)
const USE_COOKIES = false

let accessToken: string | null = localStorage.getItem('accessToken') || null
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

export const setAccessToken = (token: string | null) => {
  accessToken = token
  if (token) localStorage.setItem('accessToken', token)
  else localStorage.removeItem('accessToken')
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: USE_COOKIES, // 쿠키 쓸 때만 true
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Authorization 헤더 붙이기 (헤더 기반일 때만)
http.interceptors.request.use((config) => {
  if (!USE_COOKIES && accessToken) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 401에서 한 번만 리프레시 시도
async function refreshTokenOnce(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => pendingQueue.push(resolve))
  }

  isRefreshing = true
  try {
    // 같은 인스턴스(http)로 호출해서 baseURL/withCredentials 일관 유지
    const res = await http.post(
      // baseURL이 /api까지 포함하므로 경로는 /auth/refresh
      '/auth/refresh',
      USE_COOKIES ? {} : { refreshToken: localStorage.getItem('refreshToken') }
    )

    const newAccess = (res.data?.data?.accessToken ?? res.data?.accessToken) as string | undefined
    if (!USE_COOKIES && newAccess) setAccessToken(newAccess)

    pendingQueue.forEach(fn => fn(newAccess ?? null))
    pendingQueue = []
    return newAccess ?? null
  } catch (e) {
    pendingQueue.forEach(fn => fn(null))
    pendingQueue = []
    setAccessToken(null)
    throw e
  } finally {
    isRefreshing = false
  }
}

http.interceptors.response.use(
  r => r,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      try {
        const newAccess = await refreshTokenOnce()
        if (!USE_COOKIES && newAccess) {
          original.headers = original.headers ?? {}
          ;(original.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`
        }
        return http(original)
      } catch {
        // 최종 실패: 필요하면 여기서 전역 로그아웃/리다이렉트
      }
    }
    return Promise.reject(error)
  }
)

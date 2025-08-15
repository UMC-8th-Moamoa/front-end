// src/services/follow.ts
// 목적: 팔로우 요청, 팔로워/팔로잉 목록 조회, 타인 프로필(OtherPage) 조회
// 전제: axios 인스턴스는 src/api/axiosInstance.ts 에서 Authorization 헤더 자동 첨부

import instance from "../api/axiosInstance";

// 공통 결과 타입: ok + payload(or reason)
export type ApiResult<T> = { ok: boolean; payload?: T; reason?: string };

// 서버가 Envelope({ success, message, data }) 이거나 바로 필드가 오는 경우를 모두 수용
function normalize<T>(data: any): ApiResult<T> {
  try {
    if (data && typeof data === "object") {
      // 1) 대표 케이스: { success: boolean, message?: string, data?: any }
      if ("success" in data) {
        const success = Boolean((data as any).success);
        if (success) return { ok: true, payload: (data as any).data as T };
        const msg = (data as any).message ?? "요청이 실패했습니다.";
        return { ok: false, reason: typeof msg === "string" ? msg : JSON.stringify(msg) };
      }

      // 2) 바로 필드가 오는 경우(예: 다른 페이지 정보 API 예시처럼)
      //    성공으로 간주하고 전체 객체를 payload로 반환
      return { ok: true, payload: data as T };
    }

    // 3) 예외: 데이터가 비어있거나 비객체
    return { ok: false, reason: "응답 형식이 올바르지 않습니다." };
  } catch (e: any) {
    return { ok: false, reason: e?.message ?? "알 수 없는 에러" };
  }
}

/* ============================
 *  타입 정의 (DTO)
 * ============================
 */

// 팔로우 요청 바디
export interface FollowRequestBody {
  user_id: string;   // 요청자 (본인)
  target_id: string; // 팔로우 대상
}

// 팔로우 요청 성공 payload 예시
export interface FollowRequestPayload {
  user_id: string;
  target_id: string;
  isFollowing: boolean;
}

// 팔로워/팔로잉 공통 아이템
export interface FollowUserItem {
  user_id: string;
  name: string | null;
  photo: string | null;
  followed_at: string; // ISO string
  // followers API: is_following(내가 그 사람을 팔로우 중인지), is_mutual
  // followings API: is_follower(그 사람이 나를 팔로우하는지), is_mutual
  is_following?: boolean;
  is_follower?: boolean;
  is_mutual: boolean;
}

// 페이지네이션 블록
export interface PaginationBlock {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

// 팔로워 목록 응답 payload
export interface FollowersPayload {
  followers: FollowUserItem[];
  pagination: PaginationBlock;
}

// 팔로잉 목록 응답 payload
export interface FollowingsPayload {
  followings: FollowUserItem[];
  pagination: PaginationBlock;
}

// 타인 페이지(OtherPage) 정보
export interface OtherPageInfo {
  success?: boolean; // 스펙에 포함되기도 해서 optional
  OtherInfo?: {
    user_id: string;
    name: string;
    birthday: string;      // "YYYY-MM-DD"
    followers_num: number; // 팔로워 수
    following_num: number; // 팔로잉 수
    is_following: boolean; // 내가 그 사람을 팔로우?
    is_follower: boolean;  // 그 사람이 나를 팔로우?
    photo: string | null;
  };
  massage?: string; // 서버 오타 케이스까지 그대로 수용
}

/* ============================
 *  API 함수
 * ============================
 */

/**
 * [POST] /api/follow/request
 * 설명: 팔로우 요청 생성
 * 성공시 payload: FollowRequestPayload
 */
export async function requestFollow(body: FollowRequestBody): Promise<ApiResult<FollowRequestPayload>> {
  try {
    const { data } = await instance.post("/api/follow/request", body);
    return normalize<FollowRequestPayload>(data);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "팔로우 요청 중 오류가 발생했습니다.";
    return { ok: false, reason: String(msg) };
  }
}

/**
 * [GET] /api/mypage/followers?page=&limit=
 * 설명: 나를 팔로우하는 사용자 목록
 */
export async function fetchFollowers(page = 1, limit = 20): Promise<ApiResult<FollowersPayload>> {
  try {
    const { data } = await instance.get("/api/mypage/followers", {
      params: { page, limit },
    });
    return normalize<FollowersPayload>(data?.data ?? data);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "팔로워 목록 조회 중 오류가 발생했습니다.";
    return { ok: false, reason: String(msg) };
  }
}

/**
 * [GET] /api/mypage/followings?page=&limit=
 * 설명: 내가 팔로우하는 사용자 목록
 */
export async function fetchFollowings(page = 1, limit = 20): Promise<ApiResult<FollowingsPayload>> {
  try {
    const { data } = await instance.get("/api/mypage/followings", {
      params: { page, limit },
    });
    return normalize<FollowingsPayload>(data?.data ?? data);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "팔로잉 목록 조회 중 오류가 발생했습니다.";
    return { ok: false, reason: String(msg) };
  }
}

/**
 * [GET] /api/mypage/otherpage_info?user_id={id}
 * 설명: 타인의 프로필(맞팔 여부 포함)
 * 주의: 서버 예시가 { success, OtherInfo } 형태라 그대로 normalize 후 사용
 */
export async function fetchOtherPageInfo(userId: string): Promise<ApiResult<OtherPageInfo>> {
  try {
    const { data } = await instance.get("/api/mypage/otherpage_info", {
      params: { user_id: userId },
    });
    // 서버가 { success: true, OtherInfo: {...} } 구조이므로 그대로 반환
    return normalize<OtherPageInfo>(data);
  } catch (err: any) {
    const msg =
      err?.response?.data?.massage || // 서버 예시 오타까지 방어
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "상대 프로필 조회 중 오류가 발생했습니다.";
    return { ok: false, reason: String(msg) };
  }
}

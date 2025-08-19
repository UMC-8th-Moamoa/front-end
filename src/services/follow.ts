// src/services/follow.ts
import instance from "../api/axiosInstance";
import { requestFollow as requestFollowV2 } from "../services/mypage"; // ← 핵심: v2로 위임

export type ApiResult<T> = { ok: boolean; payload?: T; reason?: string };

export type FollowUserItem = {
  user_id: string;
  name?: string;
  photo?: string;
  followed_at?: string;
  is_following?: boolean;
  is_mutual?: boolean;
};

type FollowersResp = {
  followers: FollowUserItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
};

type FollowingsResp = {
  followings: FollowUserItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
};

// ---- 기존 Normalizer 유지 (다른 API들에서 사용) ----
function normalize<T>(data: any): ApiResult<T> {
  try {
    if (data && typeof data === "object") {
      if ("success" in data) {
        const success = Boolean((data as any).success);
        if (success) return { ok: true, payload: (data as any).data as T };
        const msg = (data as any).message ?? "요청이 실패했습니다.";
        return { ok: false, reason: typeof msg === "string" ? msg : JSON.stringify(msg) };
      }
      return { ok: true, payload: data as T };
    }
    return { ok: false, reason: "INVALID_RESPONSE" };
  } catch (e: any) {
    return { ok: false, reason: e?.message ?? "NORMALIZE_ERROR" };
  }
}

/** ✅ 내 팔로워 목록: GET /api/mypage/followers */
export async function fetchFollowers(page = 1, limit = 20): Promise<ApiResult<FollowersResp>> {
  try {
    const { data } = await instance.get("/mypage/followers", { params: { page, limit } });
    return normalize<FollowersResp>(data);
  } catch (e: any) {
    const reason = e?.response?.data?.message ?? e?.message ?? "FETCH_FOLLOWERS_FAILED";
    return { ok: false, reason };
  }
}

/** ✅ 내 팔로잉 목록: GET /api/mypage/followings */
export async function fetchFollowings(page = 1, limit = 20): Promise<ApiResult<FollowingsResp>> {
  try {
    const { data } = await instance.get("/mypage/followings", { params: { page, limit } });
    return normalize<FollowingsResp>(data);
  } catch (e: any) {
    const reason = e?.response?.data?.message ?? e?.message ?? "FETCH_FOLLOWINGS_FAILED";
    return { ok: false, reason };
  }
}

/** ✅ 타인 정보 조회: GET /api/mypage/otherpage_info?user_id=... */
export async function fetchOtherPageInfo(
  userId: string
): Promise<ApiResult<{ OtherInfo: { user_id: string; name?: string; is_following?: boolean } }>> {
  try {
    const { data } = await instance.get("/mypage/otherpage_info", { params: { user_id: userId } });
    return normalize(data);
  } catch (e: any) {
    const reason = e?.response?.data?.message ?? e?.message ?? "FETCH_OTHER_INFO_FAILED";
    return { ok: false, reason };
  }
}

/* ================================
   🔁 핵심: requestFollow 어댑터
   - 기존 호출부 호환: ApiResult<{ user_id; target_id; isFollowing }>
   - 내부 구현은 mypage.requestFollow(v2)를 사용하여 단일화
   ================================ */

export type RequestFollowBody = { user_id: string; target_id: string };
export type RequestFollowResp = {
  user_id: string;
  target_id: string;
  isFollowing: boolean;
};

/** (레거시 시그니처 유지) */
export async function requestFollow(body: RequestFollowBody): Promise<ApiResult<RequestFollowResp>> {
  try {
    const res = await requestFollowV2(body); // mypage.ts 호출
    if (res.resultType === "SUCCESS" && res.success?.ok) {
      return {
        ok: true,
        payload: {
          user_id: res.success.userId,
          target_id: res.success.targetId,
          isFollowing: res.success.isFollowing,
        },
      };
    }
    return { ok: false, reason: res.error ?? "FOLLOW_REQUEST_FAILED" };
  } catch (e: any) {
    const reason = e?.response?.data?.message ?? e?.message ?? "FOLLOW_REQUEST_FAILED";
    return { ok: false, reason };
  }
}

/** (선택) v2 응답을 그대로 쓰고 싶은 코드가 있다면 이 이름으로도 export */
export { requestFollow as requestFollowV2Raw } from "../services/mypage";

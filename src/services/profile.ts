// src/services/profile.ts
import instance from "../api/axiosInstance";

export type OtherUserProfile = {
  id: number;
  userId: string;
  name: string;
  photo: string | null;
  birthday: string;
  isFollowing: boolean;
  isFollower: boolean;
  followersCount: number;
  followingCount: number;
  wishlistPreview?: Array<{ id: number; title: string; imageUrl: string | null }>;
};

type UsersApiEnvelope = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: { profile: OtherUserProfile };
};

/** 스웨거 실제 응답 형태 */
type OtherPageInfoEnvelope = {
  success: boolean;
  OtherInfo?: {
    user_id: string;
    name: string;
    birthday: string;
    followers_num: number;
    following_num: number;  // ← 단수
    is_following: boolean;
    is_follower: boolean;
    photo: string | null;
  };
};

export async function fetchOtherUserProfile(
  targetId: string | number
): Promise<OtherUserProfile | null> {
  const uid = String(targetId);

  // 1) 문서화된 otherpage_info 사용
  try {
    const { data } = await instance.get<OtherPageInfoEnvelope>("/mypage/otherpage_info", {
      params: { user_id: uid },
    });

    if (data?.success && data.OtherInfo) {
      const o = data.OtherInfo;
      return {
        id: 0, // 서버에서 별도 id를 안 주므로 0으로 고정
        userId: o.user_id,
        name: o.name,
        photo: o.photo ?? null,
        birthday: o.birthday ?? "",
        isFollowing: !!o.is_following,   // 내가 그를 팔로우?
        isFollower: !!o.is_follower,     // 그가 나를 팔로우?
        followersCount: o.followers_num ?? 0,
        followingCount: o.following_num ?? 0,
        wishlistPreview: [],
      };
    }
  } catch {
    // 계속 진행 (fallback)
  }

  // 2) (옵션) 백엔드가 열려 있다면 /users/:id도 시도
  try {
    const { data } = await instance.get<UsersApiEnvelope>(`/users/${uid}`);
    if (data?.resultType === "SUCCESS" && data?.success?.profile) {
      return data.success.profile;
    }
  } catch {
    // ignore
  }

  return null;
}

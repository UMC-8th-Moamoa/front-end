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

export async function fetchOtherUserProfile(
  targetId: string | number
): Promise<OtherUserProfile | null> {
  const uid = String(targetId);

  // 1) 문서화된 otherpage_info 먼저
  try {
    const { data } = await instance.get("/mypage/otherpage_info", {
      params: { user_id: uid },
    });

    if (data?.success) {
      // ← 아이디 키가 환경마다 다를 수 있어 모두 대비
      const mappedUserId =
        data.user_id ?? data.userId ?? data.userid ?? data.id ?? "";

      return {
        id: 0,
        userId: mappedUserId,                 // ★ 핵심
        name: data.name ?? "",
        photo: data.image ?? null,
        birthday: data.birthday ?? "",
        isFollowing: !!data.followings,       // 내가 그 사람을 팔로우?
        isFollower: !!data.followers,         // 그 사람이 나를 팔로우?
        followersCount: Number(data.followers_num ?? 0),
        followingCount: Number(data.followings_num ?? 0),
        wishlistPreview: [],
      };
    }
  } catch {
    // 계속 진행
  }

  // 2) (옵션) /users/:id 열려있으면 사용
  try {
    const { data } = await instance.get<UsersApiEnvelope>(`/users/${uid}`);
    if (data?.resultType === "SUCCESS" && data?.success?.profile) {
      return data.success.profile;
    }
  } catch {}

  return null;
}

// src/services/user/profile.ts
import instance from "../api/axiosInstance";
import { fetchOtherInfo } from "./mypage"; // ← fallback

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

type ProfileEnvelope = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: { profile: OtherUserProfile };
};

export async function fetchOtherUserProfile(targetId: string | number): Promise<OtherUserProfile | null> {
  try {
    const { data } = await instance.get<ProfileEnvelope>(`/users/${targetId}`);
    if (data.resultType === "SUCCESS" && data.success?.profile) {
      return data.success.profile;
    }
  } catch (_) {
    // 무시하고 fallback 진행
  }

  // 🔁 Fallback: /mypage/otherpage_info 로 조회 후 동일 형태로 매핑
  const fb = await fetchOtherInfo(String(targetId));
  if (fb.resultType === "SUCCESS" && fb.success?.profile) {
    const p = fb.success.profile;
    return {
      id: 0,
      userId: p.userId,
      name: p.name,
      photo: p.image || null,
      birthday: p.birthday,
      isFollowing: p.iFollowHim,
      isFollower: p.heFollowsMe,
      followersCount: p.followers,
      followingCount: p.following,
      wishlistPreview: [],
    };
  }
  return null;
}

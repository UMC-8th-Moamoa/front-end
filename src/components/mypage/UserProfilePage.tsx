// src/pages/User/UserProfilePage.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import { requestFollow, fetchOtherPageInfo } from '../../services/follow';
import UnfollowConfirmModal from './UnfollowModal';

export default function UserProfilePage() {
  const navigate = useNavigate();
  // 🔁 여기만 바꾸면 됨: { id }로 받아와!
  const { id } = useParams<{ id: string }>();
  const myUserId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    "";

  const [userInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    bio?: string;
    profileImage?: string;
    isFollowing: boolean;
  } | null>(null);

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      const res = await fetchOtherPageInfo(id);
      if (!cancelled) {
        if (res.ok && res.payload?.OtherInfo) {
          const other = res.payload.OtherInfo;
          setUserInfo({
            id: other.user_id,
            name: other.name ?? other.user_id,
            bio: '함께 선물해요 🎁',
            profileImage: 'https://via.placeholder.com/80/FFB6C1',
            isFollowing: Boolean(other.is_following),
          });
        } else {
          setUserInfo({
            id,
            name: id,
            bio: '함께 선물해요 🎁',
            profileImage: 'https://via.placeholder.com/80/FFB6C1',
            isFollowing: false,
          });
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (!userInfo) return null;

  const onClickFollow = async () => {
    if (!myUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const res = await requestFollow({ user_id: myUserId, target_id: userInfo.id });
    if (res.ok) {
      setUserInfo((prev) => prev ? { ...prev, isFollowing: true } : prev);
    } else {
      alert(res.reason ?? "팔로우 요청 실패");
    }
  };

  const onClickUnfollow = () => setShowUnfollowModal(true);
  const onConfirmUnfollow = () => {
    setUserInfo((prev) => prev ? { ...prev, isFollowing: false } : prev);
    setShowUnfollowModal(false);
  };

  return (
    <div className="max-w-[393px] mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <BackButton />
        <h1 className="text-xl font-semibold font-pretendard text-center flex-1 -ml-6">프로필</h1>
        <div className="w-6 h-6" />
      </div>

      <div className="flex flex-col items-center py-6">
        <img src={userInfo.profileImage} alt="프로필" className="w-24 h-24 rounded-full mb-4" />
        <p className="text-lg font-bold mb-1">{userInfo.name}</p>
        <p className="text-sm text-gray-500">{userInfo.bio}</p>

        {userInfo.isFollowing ? (
          <button
            className="mt-4 text-sm px-6 py-2 rounded-full border bg-gray-200 text-gray-700 border-gray-300"
            onClick={onClickUnfollow}
          >
            팔로잉 중
          </button>
        ) : (
          <button
            className="mt-4 text-sm px-6 py-2 rounded-full border bg-black text-white border-black"
            onClick={onClickFollow}
          >
            팔로우
          </button>
        )}
      </div>

      <div className="px-4 text-sm text-center text-gray-400">유저의 공개된 콘텐츠가 없습니다</div>

      <UnfollowConfirmModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={onConfirmUnfollow}
      />
    </div>
  );
}

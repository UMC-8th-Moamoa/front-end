import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userInfo, setUserInfo] = useState<any>(null);

  // 임시 사용자 정보
  useEffect(() => {
    // 실제론 API 호출
    setUserInfo({
      id: userId,
      name: '김혜주',
      bio: '함께 선물해요 🎁',
      profileImage: 'https://via.placeholder.com/80/FFB6C1',
      isFollowing: true,
    });
  }, [userId]);

  if (!userInfo) return null;

  return (
    <div className="max-w-[393px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <BackButton />
        <h1 className="text-xl font-semibold font-pretendard text-center flex-1 -ml-6">프로필</h1>
        <div className="w-6 h-6" />
      </div>

      {/* 유저 정보 */}
      <div className="flex flex-col items-center py-6">
        <img
          src={userInfo.profileImage}
          alt="프로필"
          className="w-24 h-24 rounded-full mb-4"
        />
        <p className="text-lg font-bold mb-1">{userInfo.name}</p>
        <p className="text-sm text-gray-500">{userInfo.bio}</p>

        <button
          className={`mt-4 text-sm px-6 py-2 rounded-full border transition-colors
            ${userInfo.isFollowing
              ? 'bg-gray-200 text-gray-700 border-gray-300'
              : 'bg-black text-white border-black'}
          `}
          onClick={() => setUserInfo((prev: any) => ({
            ...prev,
            isFollowing: !prev.isFollowing,
          }))}
        >
          {userInfo.isFollowing ? '팔로잉 중' : '팔로우'}
        </button>
      </div>

      {/* 유저의 콘텐츠 목록이 있다면 여기에 추가 */}
      <div className="px-4 text-sm text-center text-gray-400">유저의 공개된 콘텐츠가 없습니다</div>
    </div>
  );
}

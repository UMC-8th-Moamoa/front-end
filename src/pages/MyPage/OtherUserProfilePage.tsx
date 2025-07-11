// OtherUserFollowListPage.tsx
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { useState } from 'react';

export default function OtherUserFollowListPage() {
  const navigate = useNavigate();
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const mockUsers = [
    { id: '1', nickname: 'daisy', imgUrl: 'https://via.placeholder.com/60/FFC0CB' },
    { id: '2', nickname: 'butterfly99', imgUrl: 'https://via.placeholder.com/60/87CEFA' },
    { id: '3', nickname: 'oceanview', imgUrl: 'https://via.placeholder.com/60/98FB98' },
  ];

  const handleUnfollowClick = (id: string) => {
    setSelectedUser(id);
    setShowUnfollowModal(true);
  };

  const handleConfirmUnfollow = () => {
    // 언팔로우 처리 로직
    console.log(`${selectedUser} 언팔로우 완료`);
    setShowUnfollowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-[393px] mx-auto min-h-screen bg-white text-black">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)}>
          <img src="/assets/icon/back.svg" alt="back" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-center flex-1 -ml-6">팔로워</h1>
        <div className="w-6 h-6" />
      </div>

      {/* 팔로워 목록 */}
      <div className="px-4 space-y-4">
        {mockUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3" onClick={() => navigate(`/user/${user.id}`)}>
              <img
                src={user.imgUrl}
                alt="profile"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <span className="text-lg font-medium">{user.nickname}</span>
            </div>
            <button
              className="text-[#8F8F8F] border border-[#8F8F8F] rounded-lg px-3 py-1 text-sm"
              onClick={() => handleUnfollowClick(user.id)}
            >
              언팔로우
            </button>
          </div>
        ))}
      </div>

      {/* 언팔로우 모달 */}
      <Modal isOpen={showUnfollowModal} onClose={() => setShowUnfollowModal(false)}>
        <div className="flex flex-col items-center justify-center w-[350px] h-[130px] p-6">
          <p className="font-semibold text-[17px] mb-6">언팔로우하시겠습니까?</p>
          <div className="flex gap-4">
            <button
              className="bg-[#8F8F8F] text-white py-2 px-6 rounded-[10px] text-[15px]"
              onClick={handleConfirmUnfollow}
            >
              언팔로우
            </button>
            <button
              className="border border-[#8F8F8F] text-[#8F8F8F] py-2 px-6 rounded-[10px] text-[15px]"
              onClick={() => setShowUnfollowModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

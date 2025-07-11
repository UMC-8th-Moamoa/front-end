import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';

interface User {
  id: number;
  name: string;
  username: string;
  profileImage: string;
  dDay: string;
  isFollowing: boolean;
}

export default function FollowerFollowingListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: '금채원',
      username: 'chaoni_gold',
      profileImage: 'https://via.placeholder.com/48',
      dDay: 'D-7',
      isFollowing: true,
    },
    {
      id: 2,
      name: '코드',
      username: 'code_god',
      profileImage: 'https://via.placeholder.com/48',
      dDay: 'D-21',
      isFollowing: true,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUnfollowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUnfollowConfirm = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, isFollowing: false } : user
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleProfileClick = (user: User) => {
    navigate(`/user/${user.username}`);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-4">팔로잉</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleProfileClick(user)}
            >
              <img
                src={user.profileImage}
                alt="프로필"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.dDay}</div>
              </div>
            </div>
            {user.isFollowing && (
              <button
                onClick={() => handleUnfollowClick(user)}
                className="px-3 py-1 border rounded-full text-sm"
              >
                팔로우 취소
              </button>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="text-center">
          <p className="font-semibold mb-4">팔로우를 취소하시겠습니까?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-[120px] h-[36px] rounded-full border border-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleUnfollowConfirm}
              className="w-[120px] h-[36px] rounded-full bg-black text-white"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

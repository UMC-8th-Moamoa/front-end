import React, { useState } from "react";
import BackButton from "../../components/common/BackButton";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const blockedUsers = [
  { id: 1, name: "금채원", username: "chaoni_gold" },
  { id: 2, name: "금채원", username: "chaoni_gold" },
  { id: 3, name: "금채원", username: "chaoni_gold" },
  { id: 4, name: "금채원", username: "chaoni_gold" },
  { id: 5, name: "금채원", username: "chaoni_gold" },
  { id: 6, name: "금채원", username: "chaoni_gold" },
];

const BlockedListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleUnblockClick = (userId: number) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const handleConfirmUnblock = () => {
    console.log(`Unblocked user with id ${selectedUser}`);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-4 pb-20 bg-white text-black min-h-screen">
      {/* 상단 바 */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute left-0">
          <BackButton />
        </div>
        <h1 className="text-lg font-semibold">차단 목록</h1>
      </div>

      {/* 차단 유저 리스트 */}
      <div className="space-y-4">
        {blockedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0" />
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-gray-400">{user.username}</span>
              </div>
            </div>
            <button
              onClick={() => handleUnblockClick(user.id)}
              className="text-gray-400 text-lg hover:text-black"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* ✅ 공용 모달 적용 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <p className="text-[15px] font-semibold mb-4">
            차단을 해제하시겠습니까?
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              width="fixed"
              size="medium"
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="gray"
              width="fixed"
              size="medium"
              onClick={handleConfirmUnblock}
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlockedListPage;

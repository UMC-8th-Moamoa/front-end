import React, { useState } from 'react';
import ShoppingItemCard from '../../components/Shopping/ShoppingItemCard';
import { Modal } from '../../components/common/Modal';
import toast, { Toaster } from 'react-hot-toast';


const ShoppingListPage = () => {
  const [userMC, setUserMC] = useState(150); // 예시로 50 MC를 가진 사용자
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const sampleItem = {
    id: 1,
    name: '아이템명',
    description: '고대 로마의 양피지 스타일로 만든 종이 테마',
    price: 100,
    image: '/assets/test.png', // 실제 이미지 경로에 맞게 수정
    isOwned: false,
  };

  const handleBuy = (item: any) => {
    if (userMC < item.price) {
        toast.custom((t) => (
        <div
            className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
            } bg-white rounded-xl shadow-md px-6 py-4 w-[330px] text-center`}
        >
            <p className="text-base font-base text-black mb-2">
            몽코인이 부족합니다
            </p>
            <button
            onClick={() => {
                // 충전 페이지 이동 로직
                toast.dismiss(t.id); // 토스트 닫기
            }}
            className="text-[#6282E1] border border-[#6282E1] w-full rounded-lg px-4 py-2 text-sm font-base hover:bg-[#F1F4FF] active:border-2"
            >
            몽코인 충전하러 가기
            </button>
        </div>
        ));
    } else {
        setSelectedItem(item);
        setIsModalOpen(true);
        // 실제 구매 처리 로직 추가
    }
    };

    const handleConfirmBuy = () => {
        if (!selectedItem) return;
        setUserMC((prev) => prev - selectedItem.price); // MC 차감
        toast.success(`${selectedItem.name} 구매 완료!`);
        setIsModalOpen(false);
        setSelectedItem(null);
    };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        {/* 토스트 알림 */}
        <Toaster position="top-center" reverseOrder={false} />
        {/* 아이템 카드 */}
      <div>
        <ShoppingItemCard item={sampleItem} onBuy={handleBuy} />
      </div>
      {/* 모달창 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-[330px] px-5 py-6"
        >
        <p className="text-center text-base font-base text-[#1D1D1F] mb-4 leading-[24px]">
            {selectedItem?.name}을 구매하시겠습니까?
        </p>
        <div className="flex justify-center gap-3">
            <button
            onClick={() => setIsModalOpen(false)}
            className="w-[120px] py-2 border border-[#6282E1] text-[#6282E1] rounded-[10px] text-sm font-medium"
            >
            취소
            </button>
            <button
            onClick={handleConfirmBuy}
            className="w-[120px] py-2 bg-[#6282E1] text-white rounded-[10px] text-sm font-medium"
            >
            확인
            </button>
        </div>
        </Modal>
    </div>
  );
};

export default ShoppingListPage;
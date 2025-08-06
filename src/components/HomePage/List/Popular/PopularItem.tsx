import { useState } from "react";
import { Modal } from "../../../common/Modal";
import WhitePlus from "../../../../assets/WhitePlus.svg";

interface PopularItemProps {
  imageUrl: string;
  title: string;
  onConfirm: () => Promise<void>; // HomePage에서 내려오는 콜백
}

const PopularItem = ({ imageUrl, title, onConfirm }: PopularItemProps) => {
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태
  const [isLoading, setIsLoading] = useState(false); // API 호출 로딩 상태

  const handleConfirm = async () => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);
    try {
      await onConfirm(); // HomePage에서 내려준 콜백 실행
      setIsOpen(false);  // 모달 닫기
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-[119px] mr-[16px] relative">
      {/* 상품 이미지 */}
      <div className="relative w-[119px] h-[119px] rounded-[16px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-[16px]"
        />
        {/* 플러스 버튼 */}
        <img
          src={WhitePlus}
          alt="추가"
          className="absolute bottom-2 right-2 w-[24px] h-[24px] cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* 상품명 */}
      <p className="mt-[8px] text-[12px] text-black">{title}</p>

      {/* 위시리스트 추가 확인 모달 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-[350px] h-[130px] bg-white rounded-[20px] flex flex-col items-center justify-center">
          <p className="text-[18px] text-center mb-[16px]">
            위시리스트에 추가하시겠습니까?
          </p>
          <div className="flex space-x-[12px]">
            <button
              className="w-[132px] h-[39px] rounded-[12px] border border-[#6282E1] text-[16px] text-[#6282E1]"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              className="w-[132px] h-[39px] rounded-[12px] bg-[#6282E1] text-[16px] text-white"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "추가 중..." : "확인"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PopularItem;

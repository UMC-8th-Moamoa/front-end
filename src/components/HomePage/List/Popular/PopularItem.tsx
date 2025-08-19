// src/components/Home/Popular/PopularItem.tsx
import { useState } from "react";
import { Modal } from "../../../common/Modal";
import WhitePlus from "../../../../assets/WhitePlus.svg";
import { createWishlistManual } from "../../../../services/wishlist/register";

interface PopularItemProps {
  imageUrl: string;
  title: string;
  /** 부모가 넘겨주면 이 콜백을 우선 실행. (없으면 기본 등록 로직 수행) */
  onConfirm?: () => Promise<void>;
}

const PopularItem = ({ imageUrl, title, onConfirm }: PopularItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultRegister = async () => {
    // 기본 값: 공개 true, 가격 0원으로 수동 등록
    await createWishlistManual({
      productName: title,
      price: 0,
      imageUrl,
      isPublic: true,
    });
  };

  const handleConfirm = async () => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();        // 부모 콜백 우선
      } else {
        await defaultRegister();  // 콜백 없으면 기본 등록
      }
      setIsOpen(false);
      // 필요하면 여기서 토스트 노출 트리거를 올려도 됩니다.
      // ex) showToast("위시리스트에 추가되었습니다");
    } catch (e: any) {
      console.error("[인기 아이템 추가 실패]", e?.response?.data || e);
      alert(e?.response?.data?.message || "위시리스트 추가에 실패했어요.");
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-[350px] h-[144px]">
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

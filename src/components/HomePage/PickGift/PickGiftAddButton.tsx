// components/HomePage/PickGift/PickGiftAddButton.tsx
import { useNavigate } from "react-router-dom";

const PickGiftAddButton = () => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate("/wishlist-register")}
    >
      {/* 진한 회색 구분선 */}
      <hr className="w-full border-t h-[1px] border-[#D9D9D9] mb-4" />

      {/* 위시리스트 추가 버튼 */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-[#7B7B7B] text-[13px] font-medium mr-[6px]">
          위시리스트 추가하기
        </span>
        <img
          src="/assets/GrayPlus.svg"
          alt="추가"
          className="w-[12px] h-[12px] ml-2 mb-1"
        />
      </div>
    </div>
  );
};

export default PickGiftAddButton;

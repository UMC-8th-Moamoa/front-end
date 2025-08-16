// src/components/WishList/ManualInputSection.tsx
import { useNavigate } from "react-router-dom";
import InputBox from "../common/InputBox";
import WhitePhoto from "../../assets/WhitePhoto.svg";

type Props = {
  name: string;
  price: string;
  onNameChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  imageUrl?: string; // ✅ 추가: 미리보기용
};

const ManualInputSection = ({ name, price, onNameChange, onPriceChange, imageUrl }: Props) => {
  const navigate = useNavigate();
  const goSelectPhoto = () =>
    navigate("/wishlist/select-photo", {
      state: { targetTab: "manual", returnTo: "/wishlist/register" }, // ✅ 수동 탭 명시
    });

  return (
    <section className="w-full max-w-[393px] px-4 flex mt-3 flex-col items-center gap-4">
      <button
        type="button"
        onClick={goSelectPhoto}
        className="w-[350px] h-[201px] bg-[#F2F2F2] rounded-[20px] flex items-center justify-center border border-[#C7D5FF]"
        aria-label="사진 선택하기"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="선택한 이미지" className="w-full h-full object-cover rounded-[20px]" />
        ) : (
          <img src={WhitePhoto} alt="사진 업로드 아이콘" className="w-10 h-10" />
        )}
      </button>

      {/* 이름/가격 입력 */}
      <InputBox
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="제품명을 입력해 주세요"
        className="w-[350px] h-[44px] mt-2 rounded-xl bg-[#F2F2F2] !placeholder-[#B7B7B7]"
        hasBorder={false}
      />
      <div className="relative w-[350px] h-[50px]">
        <InputBox
          type="text"
          inputMode="numeric"
          value={price ? parseInt(price, 10).toLocaleString() : ""}
          onChange={(e) => onPriceChange(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="가격을 입력해 주세요"
          hasBorder={false}
          className={`${price ? "text-[24px] font-bold" : "text-sm"} caret-black pr-4 bg-[#F2F2F2] w-[350px] h-[44px] rounded-[12px] placeholder:text-[#B7B7B7]`}
        />
      </div>
    </section>
  );
};

export default ManualInputSection;

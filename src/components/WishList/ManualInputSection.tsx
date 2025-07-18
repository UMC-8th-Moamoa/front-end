import { useState } from "react";
import InputBox from "../common/InputBox";

const ManualInputSection = () => {
  const [price, setPrice] = useState("");

  const formatNumber = (value: string) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");
    if (!onlyNumber) return "";
    return onlyNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setPrice(formatNumber(rawValue));
  };

  return (
    <section className="w-full max-w-[393px] px-4 flex mt-3 flex-col items-center gap-4">
      {/* 회색 이미지 박스 */}
      <div className="w-[350px] h-[201px] bg-[#D9D9D9] rounded-[20px] flex items-center justify-center">
        <img src="/assets/WhitePhoto.svg" alt="사진 업로드 아이콘" className="w-10 h-10" />
      </div>

      {/* 제품명 입력 */}
      <InputBox
        placeholder="제품명을 입력해 주세요"
        className="w-[350px] h-[44px] mt-2 rounded-xl"
        hasBorder={false}
      />

      {/* 가격 입력 (InputBox 활용) */}
      <div className="relative w-[350px] h-[50px]">
        <InputBox
          type="text"
          inputMode="numeric"
          value={price}
          onChange={handlePriceChange}
          placeholder="가격을 입력해 주세요"
          className="text-transparent caret-black pr-10" // 글자 투명하게
          style={{ WebkitTextFillColor: "transparent" }}
        />

        {/* 겹쳐서 보여줄 텍스트 (입력값 + 원) */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
            price ? "text-[24px] font-bold" : "text-sm text-[#B6B6B6]"
          }`}
        >
          {price ? `${price}원` : "가격을 입력해 주세요"}
        </div>
      </div>
    </section>
  );
};

export default ManualInputSection;

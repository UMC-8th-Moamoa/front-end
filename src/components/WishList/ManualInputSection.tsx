import { useState } from "react";
import InputBox from "../common/InputBox";
import WhitePhoto from "../../assets/WhitePhoto.svg";

const ManualInputSection = () => {
  const [price, setPrice] = useState("");


  return (
    <section className="w-full max-w-[393px] px-4 flex mt-3 flex-col items-center gap-4">
      {/* 회색 이미지 박스 */}
      <div className="w-[350px] h-[201px] bg-[#F2F2F2] rounded-[20px] flex items-center justify-center border border-[#C7D5FF]">
        <img src={WhitePhoto} alt="사진 업로드 아이콘" className="w-10 h-10" />
      </div>

      {/* 제품명 입력 */}
      <InputBox
        placeholder="제품명을 입력해 주세요"
        className="w-[350px] h-[44px] mt-2 rounded-xl bg-[#F2F2F2] !placeholder-[#B7B7B7]"
        hasBorder={false}
      />

      {/* 가격 입력 (InputBox 활용) */}
      <div className="relative w-[350px] h-[50px]">
      <InputBox
        type="text"
        inputMode="numeric"
        value={price ? `${price}원` : ""}
        onChange={(e) => {
          // 숫자만 추출해서 상태 저장
          const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
          setPrice(onlyNumber);
        }}
        placeholder="가격을 입력해 주세요"
        hasBorder={false}
        className={`
          ${price ? "text-[24px] font-bold" : "text-sm"} 
          caret-black pr-4 bg-[#F2F2F2] w-[350px] h-[44px] rounded-[12px] 
          placeholder:text-[#B7B7B7]
        `}
      />



    </div>

    </section>
  );
};

export default ManualInputSection;

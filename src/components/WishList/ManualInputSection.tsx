// src/components/WishList/ManualInputSection.tsx
import InputBox from "../common/InputBox";
import WhitePhoto from "../../assets/WhitePhoto.svg";

type Props = {
  name: string;
  price: string; // 숫자만 담긴 문자열
  onNameChange: (v: string) => void;
  onPriceChange: (v: string) => void; // 숫자 문자열
  // 이미지 업로드로 URL을 쓸 거면 onImageUrlChange?: (url:string)=>void 도 추가
};

const ManualInputSection = ({ name, price, onNameChange, onPriceChange }: Props) => {
  return (
    <section className="w-full max-w-[393px] px-4 flex mt-3 flex-col items-center gap-4">
      <div className="w-[350px] h-[201px] bg-[#F2F2F2] rounded-[20px] flex items-center justify-center border border-[#C7D5FF]">
        <img src={WhitePhoto} alt="사진 업로드 아이콘" className="w-10 h-10" />
      </div>

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
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
            onPriceChange(onlyNumber);
          }}
          placeholder="가격을 입력해 주세요"
          hasBorder={false}
          className={`${price ? "text-[24px] font-bold" : "text-sm"} caret-black pr-4 bg-[#F2F2F2] w-[350px] h-[44px] rounded-[12px] placeholder:text-[#B7B7B7]`}
        />
      </div>
    </section>
  );
};

export default ManualInputSection;

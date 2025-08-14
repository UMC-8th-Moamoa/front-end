// src/components/WishList/AutoInputSection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkInputModal from "./LinkInputModal";
import PurplePhoto from "../../assets/PurplePhoto.svg";

type Props = {
  url: string;
  onUrlChange: (v: string) => void;
};

const AutoInputSection = ({ url, onUrlChange }: Props) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhotoInsert = () => {
    navigate("/moaletter/select-photo");
  };

  return (
    <section className="w-full max-w-[393px] px-4 flex flex-col items-center gap-4">
      {/* 모달 (onConfirm이 url을 넘겨주도록 LinkInputModal을 살짝 수정했는지 확인) */}
      <LinkInputModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        defaultValue={url}
        onConfirm={(newUrl: string) => {
          onUrlChange(newUrl);
          setIsLinkModalOpen(false);
        }}
      />
     


      <div className="w-[350px] h-[201px] bg-[#F2F2F2] border border-[#C7D5FF] rounded-[20px] flex mt-3 items-center justify-center">
      </div>

      {/* 제품명 + 가격 (자동 입력은 서버가 채워주므로 0원/placeholder) */}
      <div className="w-full max-w-[350px] flex flex-col items-start gap-1">
        <p className="text-[18px] text-black"></p>
        <p className="text-[24px] font-bold text-[#6282E1]">0원</p>
      </div>

      <div className="w-[350px] rounded-xl border border-[#C7D5FF] flex">
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
          onClick={() => setIsLinkModalOpen(true)}
        >
          <img src="/assets/Link.svg" alt="링크" className="w-[30px] h-[30px]" />
          <span className="text-sm font-semibold text-[#6282E1]">링크 붙여넣기</span>
        </button>

        <div className="w-px bg-[#C7D5FF]" />

        <button onClick={handlePhotoInsert} className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <img src={PurplePhoto} alt="사진" className="w-[30px] h-[30px]" />
          <span className="text-sm font-semibold text-[#6282E1]">사진 넣기</span>
        </button>
      </div>

      <p className="w-[350px] text-[12px] text-[#B7B7B7] text-left ml-5 leading-relaxed">
        링크를 붙여넣으면 자동으로 선물 정보를 입력해줘요!
      </p>
    </section>
  );
};

export default AutoInputSection;

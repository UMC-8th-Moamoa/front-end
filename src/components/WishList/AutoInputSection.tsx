// src/components/WishList/AutoInputSection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkInputModal from "./LinkInputModal";
import PurplePhoto from "../../assets/PurplePhoto.svg";

type Props = {
  url: string;
  onUrlChange: (v: string) => void;
  imageUrl?: string; // 미리보기용
};


const AutoInputSection = ({ url, onUrlChange, imageUrl }: Props) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhotoInsert = () =>
    navigate("/wishlist/select-photo", {
      state: { targetTab: "auto", returnTo: "/wishlist/register" },
    });

  return (
    <section className="w-full max-w-[393px] px-4 flex flex-col items-center gap-4">
      <LinkInputModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        defaultValue={url}
        // LinkInputModal onConfirm 안의 alert 문구만 변경
        onConfirm={(newUrl) => {
          onUrlChange(newUrl.trim());
          setIsLinkModalOpen(false);
          // 실제 등록은 상단 '등록하기' 버튼에서 진행됨
        }}

      />

      <div className="w-[350px] h-[201px] bg-[#F2F2F2] border border-[#C7D5FF] rounded-[20px] flex mt-3 items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="선택한 이미지"
            className="w-full h-full object-cover rounded-[20px]"
          />
        ) : (
          <div className="text-[#B7B7B7] text-sm">이미지가 없어요</div>
        )}
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
        <button
          onClick={handlePhotoInsert}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
        >
          <img src={PurplePhoto} alt="사진" className="w-[30px] h-[30px]" />
          <span className="text-sm font-semibold text-[#6282E1]">사진 넣기</span>
        </button>
      </div>
    </section>
  );
};

export default AutoInputSection;

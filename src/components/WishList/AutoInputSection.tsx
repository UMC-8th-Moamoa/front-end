import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkInputModal from "./LinkInputModal"; 
import PurplePhoto from "../../assets/PurplePhoto.svg";

const AutoInputSection = () => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhotoInsert = () => {
    navigate("/moaletter/select-photo"); 
  };

  return (
    <section className="w-full max-w-[393px] px-4 flex flex-col items-center gap-4">
      {/* 모달 */}
      <LinkInputModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onConfirm={() => {
          setIsLinkModalOpen(false);
          // 추가 로직 필요 시 여기에 작성
        }}
      />

      {/* 이미지 박스 */}
      <div className="w-[350px] h-[201px] bg-[#F2F2F2] border border-[#C7D5FF] rounded-[20px] flex mt-3 items-center justify-center">
        {/* (필요 시 이미지 미리보기 등 삽입) */}
      </div>

      {/* 제품명 + 가격 */}
      <div className="w-full max-w-[350px] flex flex-col items-start gap-1">
        <p className="text-[18px] text-black">제품명</p>
        <p className="text-[24px] font-bold text-[#6282E1]">0원</p>
      </div>

      {/* 링크 / 사진 넣기 버튼 박스 */}
      <div className="w-[350px] rounded-xl border border-[#C7D5FF] flex">
        {/* 링크 버튼 */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
          onClick={() => setIsLinkModalOpen(true)}
        >
          <img src="/assets/Link.svg" alt="링크" className="w-[30px] h-[30px]" />
          <span className="text-sm font-semibold text-[#6282E1]">링크 붙여넣기</span>
        </button>

        {/* 구분선 */}
        <div className="w-px bg-[#C7D5FF]" />

        {/* 사진 버튼 */}
        <button
          onClick={handlePhotoInsert}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
        >
          <img src={PurplePhoto} alt="사진" className="w-[30px] h-[30px]" />
          <span className="text-sm font-semibold text-[#6282E1]">사진 넣기</span>
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="w-[350px] text-[12px] text-[#B7B7B7] text-left ml-5 leading-relaxed">
        내가 갖고 싶은 선물의 링크 혹은 캡처 사진을 아래에 첨부하면<br />
        자동으로 선물을 입력해줘요!
      </p>
    </section>
  );
};

export default AutoInputSection;

// [코드 제목] LetterSavedPage – lettersaved.svg 배경 + 200x200 중앙 오버레이

import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import DefaultImage from "../../assets/Lettersaved.svg";

type SavedState = {
  imageUrl?: string;   // 200x200 크롭 결과 (dataURL)
  stampUrl?: string;   // 선택 우표 URL
  receiverName?: string;
};

export default function LetterSavedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as SavedState;

  // 1) 중앙에 띄울 이미지 선택 우선순위:
  //    크롭 이미지(200x200) > 우표 이미지 > null
  const centerSrc = state.imageUrl || state.stampUrl || null;

  // 2) 수신자 이름
  const receiverName = state.receiverName || "수신자";

  return (
    <div className="w-[393px] h-screen mx-auto bg-white font-pretendard overflow-hidden flex flex-col items-center relative">
      <div className="flex flex-col pt-[82px] w-[350px]">

<div
  className="
    relative
    w-[349px] h-[349px]  /* 정사각형 유지 */
    rounded-[20px] bg-[#F2F2F2]
    overflow-hidden mb-[29px]
  "
>
  {/* 배경 SVG */}
  <img
    src={DefaultImage}
    alt="배경"
    className="absolute inset-0 w-full h-full object-cover pointer-events-none" // ← ✅ contain → cover
    draggable={false}
  />

  {/* 중앙 200x200 오버레이 */}
  {centerSrc && (
    <div
      className="
        absolute left-1/2 -translate-x-1/2
        w-[200px] h-[200px]
        rounded-[20px] overflow-hidden
      "
      style={{ top: 24 }} // 필요 시 Figma 값으로 미세 조정
    >
      <img
        src={centerSrc}
        alt="저장된 이미지 또는 우표"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  )}
</div>


        {/* ===== /배경+오버레이 ===== */}

        {/* 타이틀 텍스트 */}
        <h2 className="text-[30px] font-bold text-[#1F1F1F] text-left leading-snug mb-[14px]">
          <span className="text-[#6282E1]">{receiverName}님</span>에게 전달할 편지를<br />
          저장했어요
        </h2>

        <p className="text-[19px] font-medium text-[#6C6C6C] text-left mb-[90px]">
          생일 전날까지 편지를 수정할 수 있어요!
        </p>

        <Button
          width="fixed"
          onClick={() => navigate("/home")}
          className="w-[350px] h-[50px] bg-[#6282E1] text-[#FFF] text-[20px] rounded-[10px] border-none shadow-none focus:outline-none"
        >
          <span style={{ fontWeight: 700 }}>확인</span>
        </Button>
      </div>
    </div>
  );
}

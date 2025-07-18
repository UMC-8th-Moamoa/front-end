import React from "react";
import Triangle from "../../assets/Triangle.svg";
import BackButton from "../../components/common/BackButton";

interface LetterCard {
  id: number;
}

const mockLetters: LetterCard[] = Array.from({ length: 1 }, (_, i) => ({
  id: i + 1,
}));

export default function RollingPaperGridPage() {
  const getGridCols = (length: number) => {
    if (length <= 1) return "grid-cols-1";
    if (length <= 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const cardStyle = {
    width: "280px",
    height: "280px",
    background: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  };

  return (
    <div className="relative w-[393px] h-[794px] mx-auto bg-gradient-to-b from-[#6B8EE6] to-[#DBAFFE] overflow-hidden pt-[40px] px-4 pb-[20px]">
<img
  src={Triangle}
  alt="우상단 삼각형"
  className="
    absolute 
    top-[0px]       
    right-[0px]     
    w-[113px] 
    h-[113px]
    -translate-x-[-1.5px]
    -translate-y-[0px]
  "
/>


{/* 좌측 하단 삼각형 */}
<img
  src={Triangle}
  alt="좌하단 삼각형"
  className="
    absolute 
    bottom-[0px]
    left-0 
    w-[113px] 
    h-[113px] 
    rotate-180
    -translate-x-[1px]
    -translate-y-[0px]
  "
/>


      {/* 뒤로가기 버튼 */}
      <div className="mb-4 z-10 relative">
        <BackButton />
      </div>

      {/* 카드 표시 */}
      {mockLetters.length === 1 ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex-shrink-0" style={cardStyle}></div>
        </div>
      ) : (
        <div
          className={`grid ${getGridCols(mockLetters.length)} gap-[10px] justify-center`}
        >
          {mockLetters.map((letter) => (
            <div key={letter.id} className="flex-shrink-0" style={cardStyle}></div>
          ))}
        </div>
      )}
    </div>
  );
}

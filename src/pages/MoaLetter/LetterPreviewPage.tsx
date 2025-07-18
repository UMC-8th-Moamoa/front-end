// 모아레터 - 연도별 편지 보기 페이지 (디자인 세부 반영: 카드 흰색, 헤더 정렬, 날짜 텍스트 스타일, 점선 포함)
import React, { useRef, useState } from "react";
import BottomNavigation from "../../components/common/BottomNavigation";
import MoaLetterLogo from "../../assets/Moaletter.svg";
import HorizontalIcon from "../../assets/horizontal.svg";
import VerticalIcon from "../../assets/vertical.svg";

const mockLetters = [
  { year: "2025.04.06" },
  { year: "2024.04.06" },
  { year: "2023.04.06" },
  { year: "2022.04.06" },
];

export default function MoaLetterPreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 50) {
      if (diffX < 0 && currentIndex < mockLetters.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diffX > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
    touchStartX.current = null;
  };

  const toggleViewMode = () => {
    setIsVertical((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[393px] min-h-screen mx-auto font-pretendard bg-[linear-gradient(169deg,#6282E1_1.53%,#FEC3FF_105.97%)]">
      <div className="flex flex-col min-h-screen pb-[80px]">
        {/* 상단 헤더: 로고 중앙, 보기 전환 아이콘 우측 정렬 및 여백 반영 */}
        <div className="inline-flex items-center justify-end px-[9px] pt-[9px] pb-[9px] gap-[71px]" style={{ paddingLeft: 123 }}>
          <div className="absolute left-1/2 -translate-x-1/2">
            <img src={MoaLetterLogo} alt="moa-letter" className="h-5" />
          </div>
<button
  onClick={toggleViewMode}
  className="bg-transparent border-none outline-none shadow-none focus:outline-none active:outline-none"
>
  <img
    src={isVertical ? VerticalIcon : HorizontalIcon}
    alt="보기 전환"
    className="w-[36px] h-[41px]"
  />
</button>

        </div>

        {/* 본문 내용 */}
        <div className="flex-1 overflow-y-auto px-4">
          {isVertical ? (
           <div className="flex flex-col gap-6 pb-4 items-center">
  {mockLetters.map((letter, idx) => (
    <div key={idx} className="flex flex-col items-center gap-[2px]">
      {/* 날짜 텍스트 */}
      <p
        className="text-white text-center text-[18px] font-medium leading-none mb-[8px]"
        style={{
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Pretendard",
          fontSize: "18px",
          fontWeight: 500,
          lineHeight: "normal",
          fontStyle: "normal",
        }}
      >
        {letter.year}
      </p>

      {/* 카드*/}
      <div
        className="relative bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[350px] h-[161px] mb-[45px]"
        style={{ backgroundColor: "#FFF" }}
      >
      </div>
    </div>
  ))}
</div>

          ) : (
            <div
              className="relative flex flex-col items-center justify-center h-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
{/* 카드 */}
<div
  className="bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative z-10 mb-[45px]"
  style={{ width: 275, height: 508, backgroundColor: "#FFF" }}
/>

{/* 점선 + 흰색 동그라미 */}
<div className="relative w-full h-[22px] flex items-center justify-center mb-3 overflow-visible">
{/* 오른쪽 점선 */}
{currentIndex === 0 && (
  <div
    className="absolute h-[2px]"
    style={{
      left: "50%",
      width: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      background: "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
      zIndex: 0,
    }}
  />
)}

{/* 중간 페이지들 */}
{currentIndex > 0 && currentIndex < mockLetters.length - 1 && (
  <>
    {/* 왼쪽 점선 */}
    <div
      className="absolute left-0 h-[2px]"
      style={{
        width: "50%",
        top: "50%",
        transform: "translateY(-50%)",
        background: "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
        zIndex: 0,
      }}
    />
    {/* 오른쪽 점선 */}
    <div
      className="absolute right-0 h-[2px]"
      style={{
        width: "50%",
        top: "50%",
        transform: "translateY(-50%)",
        background: "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
        zIndex: 0,
      }}
    />
  </>
)}

{/* 마지막 페이지: 왼쪽 점선만 */}
{currentIndex === mockLetters.length - 1 && (
  <div
    className="absolute right-1/2 h-[2px]"
    style={{
      width: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      background: "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
      zIndex: 0,
    }}
  />
)}


  {/* 가운데 원 */}
  <div
    className="w-[22px] h-[22px] rounded-full z-10"
    style={{ backgroundColor: "#FFF" }}
  />
</div>







              {/* 날짜 텍스트 스타일 정확히 적용 */}
                <p
                  className="text-white text-center text-[18px] font-medium leading-none w-[97px] h-[22px]"
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Pretendard",
                    fontSize: "18px",
                    fontWeight: 500,
                    lineHeight: "normal",
                    fontStyle: "normal",
                  }}
                >
                  {mockLetters[currentIndex].year}
                </p>


              {/* 인디케이터: 현재 위치를 점으로 표시 */}
              <div className="flex justify-center mt-2 gap-2">
                {mockLetters.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? "bg-white" : "bg-white opacity-30"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 고정 네비게이션 바 */}
        <BottomNavigation active="letter" onNavigate={() => {}} />
      </div>
    </div>
  );
}

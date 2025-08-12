import React, { useRef, useState, useEffect } from "react";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";
import MoaLetterLogo from "../../assets/Moaletter.svg";
import HorizontalIcon from "../../assets/horizontal.svg";
import VerticalIcon from "../../assets/vertical.svg";
import { useNavigate } from "react-router-dom";
import HeartIcon from "../../assets/Heart_2.svg";
import { getLetters, type LetterItem } from "../../api/letters"; 

const mockLetters = [
  { year: "2025.04.06", hasHeart: true },
  { year: "2024.04.06", hasHeart: false },
  { year: "2023.04.06", hasHeart: false },
  { year: "2022.04.06", hasHeart: false },
];

export default function MoaLetterPreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [items, setItems] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleNavigate = (menu: MenuType) => {
    switch (menu) {
      case "shopping":
        navigate("/shopping");
        break;
      case "heart":
        navigate("/wishlist");
        break;
      case "home":
        navigate("/home");
        break;
      case "letter":
        navigate("/moaletter/preview");
        break;
      case "mypage":
        navigate("/mypage");
        break;
    }
  };

  // mount 시 localStorage에서 불러오기
  useEffect(() => {
    const savedMode = localStorage.getItem("moa_view_mode");
    if (savedMode === "vertical") setIsVertical(true);
    else if (savedMode === "horizontal") setIsVertical(false);
  }, []);

  // 최초 1회 편지 목록 로드
useEffect(() => {
  const birthdayEventId = 7; // 실제 테스트할 이벤트 ID
  setLoading(true);
  getLetters(birthdayEventId, 1, 15)
    .then((res) => {
      setItems(res.content ?? []);
      setError(null);
    })
    .catch(() => setError("편지 목록을 불러오지 못했습니다."))
    .finally(() => setLoading(false));
}, []);


  // 보기 방식 전환 + 저장
  const toggleViewMode = () => {
    setIsVertical((prev) => {
      const next = !prev;
      localStorage.setItem("moa_view_mode", next ? "vertical" : "horizontal");
      return next;
    });
  };

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

  return (
    <div className="w-full max-w-[393px] min-h-screen mx-auto font-pretendard bg-[linear-gradient(169deg,#6282E1_1.53%,#FEC3FF_105.97%)]">
      <div className="flex flex-col min-h-screen pb-[80px]">

        {loading && (
          <div className="text-white text-center py-4">불러오는 중…</div>
        )}
        {error && (
          <div className="text-white text-center py-2">{error}</div>
        )}

        {/* 상단 헤더 */}
        <div
          className="inline-flex items-center justify-end px-[9px] pt-[9px] pb-[9px] gap-[71px]"
          style={{ paddingLeft: 123 }}
        >
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
          {/* 세로모드 */}
          {isVertical ? (
            <div className="flex flex-col gap-6 pb-4 items-center">
              {mockLetters.map((letter, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-[2px]"
                  onClick={() => navigate("/moaletter/rolling-paper")}
                >
                  {/* 날짜 텍스트 */}
                  <p className="text-white text-center text-[18px] font-medium leading-none mb-[8px]">
                    {letter.year}
                  </p>

                  {/* 카드 */}
                  <div className="relative bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[350px] h-[161px] mb-[45px]">
                    {letter.hasHeart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/moaletter/receipt");
                        }}
                        className="absolute top-[12px] right-[12px] z-20 bg-transparent border-none outline-none p-0 m-0"
                      >
                        <img src={HeartIcon} alt="하트" className="w-[24px] h-[24px]" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 가로모드
            <div
              className="relative flex flex-col items-center justify-center h-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                onClick={() => navigate("/moaletter/rolling-paper")}
                className="bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative z-10 mb-[45px]"
                style={{ width: 275, height: 508 }}
              >
                {mockLetters[currentIndex].hasHeart && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/moaletter/receipt");
                    }}
                    className="absolute top-[12px] right-[12px] z-20 bg-transparent border-none outline-none p-0 m-0"
                  >
                    <img src={HeartIcon} alt="하트" className="w-[24px] h-[24px]" />
                  </button>
                )}
              </div>

              {/* 점선 + 원 */}
              <div className="relative w-full h-[22px] flex items-center justify-center mb-3 overflow-visible">
                {currentIndex === 0 && (
                  <div
                    className="absolute h-[2px]"
                    style={{
                      left: "50%",
                      width: "50%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background:
                        "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                )}
                {currentIndex > 0 && currentIndex < mockLetters.length - 1 && (
                  <>
                    <div
                      className="absolute left-0 h-[2px]"
                      style={{
                        width: "50%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background:
                          "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                    <div
                      className="absolute right-0 h-[2px]"
                      style={{
                        width: "50%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background:
                          "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  </>
                )}
                {currentIndex === mockLetters.length - 1 && (
                  <div
                    className="absolute right-1/2 h-[2px]"
                    style={{
                      width: "50%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background:
                        "repeating-linear-gradient(to right, #FFF, #FFF 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                )}
                <div className="w-[22px] h-[22px] rounded-full" style={{ backgroundColor: "#FFF" }} />
              </div>

              {/* 날짜 텍스트 */}
              <p className="text-white text-center text-[18px] font-medium leading-none w-[97px] h-[22px]">
                {mockLetters[currentIndex].year}
              </p>

              {/* 인디케이터 */}
              <div className="flex justify-center mt-2 gap-2">
                {mockLetters.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-white" : "bg-white opacity-30"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 w-full max-w-[393px] left-1/2 -translate-x-1/2 z-50">
          <BottomNavigation active="letter" onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

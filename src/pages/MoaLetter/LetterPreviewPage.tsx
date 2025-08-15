// src/pages/MoaLetter/LetterPreviewPage.tsx
import React, { useRef, useState, useEffect } from "react";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";
import MoaLetterLogo from "../../assets/Moaletter.svg";
import HorizontalIcon from "../../assets/horizontal.svg";
import VerticalIcon from "../../assets/vertical.svg";
import { useNavigate } from "react-router-dom";
import { getLetters, type LetterListItem } from "../../services/letters";

export default function MoaLetterPreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [items, setItems] = useState<LetterListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleNavigate = (menu: MenuType) => {
    switch (menu) {
      case "shopping": navigate("/shopping"); break;
      case "heart":    navigate("/wishlist"); break;
      case "home":     navigate("/home"); break;
      case "letter":   navigate("/moaletter/preview"); break;
      case "mypage":   navigate("/mypage"); break;
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("moa_view_mode");
    if (savedMode === "vertical") setIsVertical(true);
    else if (savedMode === "horizontal") setIsVertical(false);
  }, []);

  // 이벤트 ID는 서비스 레벨에서 pickEventId로 안전 보정됨
  useEffect(() => {
    setLoading(true);
    getLetters(0, 1, 15)
      .then((res) => {
        setItems(res.content ?? []);
        setError(null);
        setCurrentIndex(0);
      })
      .catch(() => setError("편지 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

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
      if (diffX < 0 && currentIndex < Math.max(items.length - 1, 0)) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diffX > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
    touchStartX.current = null;
  };

  const openDetail = (item: LetterListItem | null) => {
    if (!item) return;
    navigate(`/moaletter/letters/${item.id}`, {
      state: { senderName: `보낸이 ${item.senderId}` },
    });
  };

  const currentItem = items.length > 0 ? items[currentIndex] : null;

  return (
    <div className="w-full max-w-[393px] min-h-screen mx-auto font-pretendard bg-[linear-gradient(169deg,#6282E1_1.53%,#FEC3FF_105.97%)]">
      <div className="flex flex-col min-h-screen pb-[80px]">
        {loading && <div className="text-white text-center py-4">불러오는 중…</div>}
        {error && <div className="text-white text-center py-2">{error}</div>}

        {/* 헤더 */}
        <div className="inline-flex items-center justify-end px-[9px] pt-[9px] pb-[9px] gap-[71px]" style={{ paddingLeft: 123 }}>
          <div className="absolute left-1/2 -translate-x-1/2">
            <img src={MoaLetterLogo} alt="moa-letter" className="h-5" />
          </div>
          <button onClick={toggleViewMode} className="bg-transparent border-none outline-none shadow-none">
            <img src={isVertical ? VerticalIcon : HorizontalIcon} alt="보기 전환" className="w-[36px] h-[41px]" />
          </button>
        </div>

        {/* 본문 */}
        <div className={`flex-1 px-4 ${isVertical ? "overflow-y-auto" : "overflow-visible pb-[120px]"}`}>
          {isVertical ? (
            <div className="flex flex-col gap-6 pb-4 items-center">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-[2px]" onClick={() => openDetail(item)}>
                  <p className="text-white text-center text-[18px] font-medium leading-none mb-[8px]">
                    {item.title}
                  </p>
                  <div className="relative bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[350px] h-[161px] mb-[45px]" />
                </div>
              ))}
              {items.length === 0 && !loading && !error && (
                <div className="text-white text-center py-6">표시할 편지가 없습니다.</div>
              )}
            </div>
          ) : (
            <div
              className="relative flex flex-col items-center justify-center min-h-[560px] py-4"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                onClick={() => openDetail(currentItem)}
                className="bg-white rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative z-10 mb-[45px] overflow-hidden"
                style={{ width: 275, height: 508 }}
              />
              {/* 점선/인디케이터 등은 기존 그대로 */}
              <p className="text-white text-center text-[18px] font-medium leading-none w-[260px] text-ellipsis overflow-hidden whitespace-nowrap">
                {(!error && currentItem) ? currentItem.title : (items.length === 0 ? "편지 없음" : "")}
              </p>
              <div className="flex justify-center mt-2 gap-2">
                {items.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-white" : "bg-white opacity-30"}`} />
                ))}
              </div>
              {items.length === 0 && !loading && !error && (
                <div className="text-white text-center py-6">표시할 편지가 없습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* 하단 네비 */}
        <div className="fixed bottom-0 w-full max-w-[393px] left-1/2 -translate-x-1/2 z-50">
          <BottomNavigation active="letter" onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

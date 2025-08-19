// src/pages/MoaLetter/LetterPreviewPage.tsx
// 제목: 모아레터 미리보기(봉투 목록) - 박스 제거, 세로/가로 봉투 분리, 클릭 라우팅 고정

import React, { useRef, useState, useEffect } from "react";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";
import MoaLetterLogo from "../../assets/Moaletter.svg";
import HorizontalIcon from "../../assets/horizontal.svg";
import VerticalIcon from "../../assets/vertical.svg";
import { useNavigate } from "react-router-dom";
import { getLetters, type LetterListItem } from "../../services/letters";

// 세로(세로로 긴) 봉투 1~4
import EnvV1 from "../../assets/moaletter/envelop1.svg";
import EnvV2 from "../../assets/moaletter/envelop2.svg";
import EnvV3 from "../../assets/moaletter/envelop3.svg";
import EnvV4 from "../../assets/moaletter/envelop4.svg";

// 가로(가로로 긴) 봉투 5~8
import EnvH5 from "../../assets/moaletter/envelop5.svg";
import EnvH6 from "../../assets/moaletter/envelop6.svg";
import EnvH7 from "../../assets/moaletter/envelop7.svg";
import EnvH8 from "../../assets/moaletter/envelop8.svg";

const VERTICAL_ENVS = [EnvV1, EnvV2, EnvV3, EnvV4]; // 세로형
const HORIZONTAL_ENVS = [EnvH5, EnvH6, EnvH7, EnvH8]; // 가로형

export default function MoaLetterPreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false); // false=캐러셀(세로형), true=리스트(가로형)
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

  // 봉투 클릭 → 롤링페이퍼(우표) 그리드
  const openRollingGrid = (item: LetterListItem | null) => {
    if (!item) return;
    navigate(`/moaletter/letters/${item.id}/rolling`, {
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
            // 리스트 모드: 가로형(5~8) 이미지 사용, 크기 350x161
            <div className="flex flex-col gap-6 pb-4 items-center">
              {items.map((item, idx) => {
                const src = HORIZONTAL_ENVS[idx % HORIZONTAL_ENVS.length];
                return (
                  <div key={item.id} className="flex flex-col items-center gap-[8px]">
                    <p className="text-white text-center text-[18px] font-medium leading-none">
                      {item.title}
                    </p>
                    <img
                      src={src}
                      alt="편지봉투(가로)"
                      className="rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
                      style={{ width: 350, height: 161 }}
                      onClick={() => openRollingGrid(item)}
                    />
                  </div>
                );
              })}
              {items.length === 0 && !loading && !error && (
                <div className="text-white text-center py-6">표시할 편지가 없습니다.</div>
              )}
            </div>
          ) : (
            // 캐러셀 모드: 세로형(1~4) 이미지 사용, 크기 275x508
            <div
              className="relative flex flex-col items-center justify-center min-h-[560px] py-4"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={VERTICAL_ENVS[currentIndex % VERTICAL_ENVS.length]}
                alt="편지봉투(세로)"
                className="rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
                style={{ width: 275, height: 508 }}
                onClick={() => openRollingGrid(currentItem)}
              />
              <p className="text-white text-center text-[18px] font-medium leading-none w-[260px] text-ellipsis overflow-hidden whitespace-nowrap mt-[12px]">
                {currentItem ? currentItem.title : ""}
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

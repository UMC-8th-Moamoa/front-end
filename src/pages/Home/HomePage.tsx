// src/pages/HomePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";
import FriendLetterList from "../../components/HomePage/List/Birthday/FriendLetterList";
import UpcomingFriendList from "../../components/HomePage/List/Birthday/UpcomingFriendList";
import PopularList from "../../components/HomePage/List/Popular/PopularList";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";
import Calendar from "../../components/HomePage/Calendar/Calendar";
import { Modal } from "../../components/common/Modal";

// ✅ 추가
import { fetchMoasAndBanners } from "../../services/banner/banner";
import type { MainBannerPayload } from "../../services/banner/banner";
import { navigateByMainBanner } from "../../services/banner/route";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [showWishBanner, setShowWishBanner] = useState(false);
  const bannerTimer = useRef<number | null>(null);

  // ✅ 메인배너 상태
  const [mainBanner, setMainBanner] = useState<MainBannerPayload | null>(null);
  const [loadingMain, setLoadingMain] = useState(true);

  // ✅ 유저 이름 (localStorage에서 추출, 있으면 사용)
  const userName = useMemo(() => {
    try {
      const direct =
        localStorage.getItem("userName") ||
        localStorage.getItem("username") ||
        localStorage.getItem("name");
      if (direct) return direct;
      const raw =
        localStorage.getItem("profile") ||
        localStorage.getItem("user") ||
        localStorage.getItem("me");
      if (raw) {
        const o = JSON.parse(raw);
        return o?.name ?? o?.userName ?? o?.username ?? undefined;
      }
    } catch {}
    return undefined;
  }, []);

  useEffect(() => {
    if (location.state?.showTransferPendingModal) {
      setIsTransferModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleShowWishBanner = () => {
    setShowWishBanner(true);
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setShowWishBanner(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    };
  }, []);

  // ✅ 메인배너 API 호출
  useEffect(() => {
    let mounted = true;
    fetchMoasAndBanners({ limit: 10 })
      .then((s) => {
        if (!mounted) return;
        setMainBanner(s.mainBanner ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setMainBanner(null);
      })
      .finally(() => mounted && setLoadingMain(false));
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 배너 클릭 시 라우팅
  const handleMainBannerClick = (moaId: number | null, type: any) => {
    navigateByMainBanner(navigate, { type, moaId });
  };

  // ✅ participating: 홈 진입 시 UpcomingList로 스크롤
  useEffect(() => {
    if (location.state?.scrollTo === "upcoming") {
      // 렌더 완료 이후 스크롤
      const t = setTimeout(() => {
        const el = document.getElementById("upcoming-list");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
      // state 제거(뒤로가기 등에서 반복 스크롤 방지)
      // react-router로 깔끔히 비우기
      navigate(".", { replace: true, state: {} });
      return () => clearTimeout(t);
    }
  }, [location.state, navigate]);

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

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center relative">
        {showWishBanner && (
          <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[350px] h-[77px] bg-white rounded-[12px] shadow-md flex flex-col items-center justify-center z-[9999]">
            <p className="text-[18px] font-medium text-[#1F1F1F]">위시리스트에 등록 완료</p>
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-[12px] font-medium text-[#B7B7B7] mt-[4px] underline underline-offset-2"
            >
              위시리스트로 가기 &gt;
            </button>
          </div>
        )}

        {/* TopBar 고정 */}
        <header className="sticky top-0 z-50 bg-white">
          <TopBar />
        </header>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="flex flex-col items-center flex-1 overflow-y-auto pb-[30px]">
          {/* ✅ 메인배너 영역: 로딩 스켈레톤 -> 실제 배너 */}
          {loadingMain ? (
            <div className="w-[350px] h-[120px] rounded-[20px] bg-gray-100 animate-pulse mt-2" />
          ) : mainBanner ? (
            <MainBanner
              payload={mainBanner}
              userName={userName}
              onClick={handleMainBannerClick}
            />
          ) : null}

          {/* ✅ 서브배너: userName 전달 */}
          <SubBannerCarousel userName={userName} />

          <FriendLetterList />
          <PopularList onAdded={handleShowWishBanner} />

          {/* ✅ 여기 id로 앵커 지정 */}
          <div id="upcoming-list">
            <UpcomingFriendList />
          </div>

          <BirthdayBanner />
          {/* 캘린더 아래 20px */}
          <div className="mb-10">
            <Calendar />
          </div>
        </div>

        {/* BottomNavigation 고정 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white w-full max-w-[393px]">
          <BottomNavigation active="home" onNavigate={handleNavigate} />
        </footer>

        {/* 송금 미완료 알림 모달 */}
        {isTransferModalOpen && (
          <Modal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            className="w-[350px] h-[140px] px-6 py-6"
          >
            <div className="w-full h-full flex flex-col justify-between items-center">
              <p className="text-[18px] font-normal mt-1 text-black text-center">
                아직 송금이 완료되지 않았습니다
              </p>
              <button
                onClick={() => {
                  setIsTransferModalOpen(false);
                  navigate("/receive-complete", {
                    state: { amount: location.state?.amount || 0 },
                  });
                }}
                className="w-[120px] h-[40px] bg-[#6282E1] text-white text-[18px] rounded-[12px] mt-3"
              >
                확인
              </button>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
};

export default HomePage;

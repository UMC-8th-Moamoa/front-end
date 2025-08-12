import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import WishListSection from "../../components/WishList/WishListSection";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";

const WishListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.showToast) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
      <div className="max-w-[393px] w-full flex flex-col relative">
        {/* ✅ TopBar fixed로 고정 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 bg-white">
          <TopBar />
        </div>

        {/* ✅ 등록 완료 안내 토스트 */}
        {showToast && (
          <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[999]">
            <div className="w-[350px] h-[77px] bg-white rounded-[12px] shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-[18px] text-[#000000]">위시리스트 등록 완료</p>
              <p className="text-[16px] text-[#A0A0A0]">언제든 수정, 삭제할 수 있습니다</p>
            </div>
          </div>
        )}

        {/* ✅ 고정된 TopBar 높이만큼 여백 주기 */}
        <div className="pt-[45px]">
          <WishListSection />
        </div>

        {/* ✅ 플로팅 버튼 */}
        <button
          onClick={() => navigate("/wishlist/register")}
          className="w-[70px] h-[70px] rounded-full bg-[#6282E1] shadow-[2px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center fixed bottom-[84px] right-5 z-50"
        >
          <img src="/assets/GrayPlus.svg" alt="추가하기" className="w-[24px] h-[24px]" />
        </button>

        {/* ✅ BottomNavigation */}
        <div className="mt-[1px] w-full max-w-[393px] fixed bottom-0 z-50 bg-[#FFF]">
          <BottomNavigation active="heart" onNavigate={handleNavigate} />
        </div>
      </div>
    </main>
  );
};

export default WishListPage;

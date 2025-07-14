import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/common/BottomNavigation";
import TopBar from "../../components/common/TopBar";
import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import WishListSection from "../../components/WishList/WishListSection";

const WishListPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col relative">
        {/* ✅ TopBar fixed로 고정 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 bg-white">
          <TopBar />
        </div>

        {/* ✅ 고정된 TopBar 높이만큼 여백 주기 */}
        <div className="pt-[56px]"> {/* TopBar 높이가 56px이라는 가정 */}
          <MainBanner {...dummyMainBanner} />
          <WishListSection />
        </div>

        {/* 회색 원형 + 버튼 */}
        <button
          onClick={() => navigate("/wishlist/register")}
          className="w-[70px] h-[70px] rounded-full bg-[#8F8F8F] flex items-center justify-center fixed bottom-[84px] right-5 z-50"
        >
          <img src="/assets/GrayPlus.svg" alt="추가하기" className="w-[24px] h-[24px]" />
        </button>

        <BottomNavigation />
      </div>
    </main>
  );
};


export default WishListPage;

import BottomNavigation from "../../components/common/BottomNavigation";
import TopBar from "../../components/common/TopBar";
import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import WishListSection from "../../components/WishList/WishListSection";

const WishListPage = () => {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center">
        <div>
          <TopBar />
          <MainBanner {...dummyMainBanner} />
          <WishListSection />
        </div>

        {/* 회색 원형 + 버튼 */}
        <button
          className="w-[70px] h-[70px] rounded-full bg-[#D9D9D9] flex items-center justify-center fixed bottom-[84px] right-5 z-50"
        >
          <img src="/assets/Plus.svg" alt="추가하기" className="w-[24px] h-[24px]" />
        </button>

        <BottomNavigation />
      </div>
    </main>
  );
};

export default WishListPage;

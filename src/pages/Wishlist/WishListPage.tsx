import BottomNavigation from "../../components/common/BottomNavigation";
import TopBar from "../../components/common/TopBar";
import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import WishListSection from "../../components/WishList/WishListSection";

const WishListPage = () => {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] flex flex-col justify-center">
        <div>
          <TopBar />
          <MainBanner {...dummyMainBanner} />
          <WishListSection />
        </div>

        <BottomNavigation />
      </div>
    </main>
  );
};

export default WishListPage;

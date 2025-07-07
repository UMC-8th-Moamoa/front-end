import TopBar from "../../components/common/TopBar";
import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-4">
      <MainBanner {...dummyMainBanner} />
      <SubBannerCarousel />
    </div>
  );
};

export default HomePage;


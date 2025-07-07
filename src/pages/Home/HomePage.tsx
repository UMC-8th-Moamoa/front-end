import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";


const HomePage = () => {
  return (
    <div className="p-4 space-y-4">
      <MainBanner {...dummyMainBanner} />
      <SubBannerCarousel />
    </div>
  );
};

export default HomePage;

import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 space-y-4">
      <MainBanner {...dummyMainBanner} />
      <SubBannerCarousel />
      <BirthdayBanner name="채원" birthday="2025-01-19" />
    </div>
  );
};

export default HomePage;


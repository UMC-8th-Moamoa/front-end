import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col justify-center px-4 space-y-4">
        <MainBanner {...dummyMainBanner} />
        <SubBannerCarousel />
        <BirthdayBanner name="채원" birthday="2025-01-19" />

        <button
          onClick={() => navigate("/wishlist")}
          className="mt-10 px-6 py-2 rounded-full bg-black text-white text-sm self-start"
        >
          wishlist
        </button>
      </div>
    </main>
  );
};

export default HomePage;

import { dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";
import { useNavigate } from "react-router-dom"; // 👈 라우팅용 추가

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 space-y-4">
      <MainBanner {...dummyMainBanner} />
      <SubBannerCarousel />
      <BirthdayBanner name="채원" birthday="2025-01-19" />

      {/* 👇 wishlist 버튼 추가 */}
      <button
        onClick={() => navigate("/wishlist")}
        className="mt-10 px-6 py-2 rounded-full bg-black text-white text-sm"
      >
        wishlist
      </button>
    </div>
  );
};

export default HomePage;


import TopBar from "../../components/common/TopBar";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";
import FriendLetterList from "../../components/HomePage/List/Birthday/FriendLetterList";
import UpcomingFriendList from "../../components/HomePage/List/Birthday/UpcomingFriendList";
import PopularList from "../../components/HomePage/List/WishList/PopularList";
import BottomNavigation from "../../components/common/BottomNavigation";
import { dummyBirthdayBanner, dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import Calendar from "../../components/HomePage/Calendar/Calendar";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center relative">
        {/* TopBar 고정 */}
        <header className="sticky top-0 z-50 bg-white">
          <TopBar />
        </header>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="flex flex-col items-center flex-1 overflow-y-auto pb-[60px]">
          <MainBanner {...dummyMainBanner} />
          <SubBannerCarousel />
          <FriendLetterList />
          <PopularList />
          <UpcomingFriendList />
          <BirthdayBanner {...dummyBirthdayBanner} />
          <Calendar />
        </div>

        {/* BottomNavigation 고정 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white w-full max-w-[393px]">
          <BottomNavigation />
        </footer>
      </div>
    </main>
  );
};

export default HomePage;

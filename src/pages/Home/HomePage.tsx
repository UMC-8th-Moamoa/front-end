import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import BirthdayBanner from "../../components/HomePage/Banner/BirthdayBanner";
import MainBanner from "../../components/HomePage/Banner/MainBanner";
import SubBannerCarousel from "../../components/HomePage/Banner/SubBannerCarousel";
import FriendLetterList from "../../components/HomePage/List/Birthday/FriendLetterList";
import UpcomingFriendList from "../../components/HomePage/List/Birthday/UpcomingFriendList";
import PopularList from "../../components/HomePage/List/Popular/PopularList";
import BottomNavigation from "../../components/common/BottomNavigation";
import { dummyBirthdayBanner, dummyMainBanner } from "../../components/HomePage/Banner/BannerDummy";
import Calendar from "../../components/HomePage/Calendar/Calendar";
import { Modal } from "../../components/common/Modal";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.showTransferPendingModal) {
      setIsTransferModalOpen(true);
      // 모달 상태 초기화 (뒤로가기 시 또 안뜨게)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center relative">
        {/* TopBar 고정 */}
        <header className="sticky top-0 z-50 bg-white">
          <TopBar />
        </header>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="flex flex-col items-center flex-1 overflow-y-auto pb-[60px]">
          <MainBanner {...dummyMainBanner} onClick={() => navigate("/moa-collected")} />
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

        {/* ❗구글폼 작성 후 알림 모달 */}
        {isTransferModalOpen && (
          <Modal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)} // 모달 닫기만 담당
          className="w-[350px] h-[140px] px-6 py-6"
        >
          <div className="w-full h-full flex flex-col justify-between items-center">
            <p className="text-[20px] font-medium text-black text-center">
              아직 송금이 완료되지 않았습니다
            </p>
            <button
              onClick={() => {
                setIsTransferModalOpen(false);
                navigate("/receive-complete", {
                  state: {
                    amount: location.state?.amount || 0,
                  },
                });
              }}
              className="w-[120px] h-[40px] bg-gray-400 text-white text-[18px] rounded-[12px] mt-3"
            >
              확인
            </button>
          </div>
        </Modal>
        
        )}
      </div>
    </main>
  );
};

export default HomePage;

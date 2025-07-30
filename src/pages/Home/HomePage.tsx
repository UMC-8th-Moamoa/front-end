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
  const [showWishBanner, setShowWishBanner] = useState(false);

  useEffect(() => {
    if (location.state?.showTransferPendingModal) {
      setIsTransferModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleWishConfirm = () => {
    setShowWishBanner(true);
    setTimeout(() => setShowWishBanner(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center relative">
        {showWishBanner && (
          <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[350px] h-[77px] bg-white rounded-[12px] shadow-md flex flex-col items-center justify-center z-[9999]">
            <p className="text-[18px] font-medium text-[#1F1F1F]">위시리스트에 등록 완료</p>
            <p className="text-[12px] font-medium text-[#B7B7B7] mt-[4px]">위시리스트로 가기 &gt;</p>
          </div>
        )}

        {/* TopBar 고정 */}
        <header className="sticky top-0 z-50 bg-white">
          <TopBar />
        </header>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="flex flex-col items-center flex-1 overflow-y-auto pb-[60px]">
          <MainBanner {...dummyMainBanner} onClick={() => navigate("/moa-collected")} />
          <SubBannerCarousel />
          <FriendLetterList />
          <PopularList onWishConfirm={handleWishConfirm} />
          <UpcomingFriendList />
          <BirthdayBanner {...dummyBirthdayBanner} />
          <Calendar />
        </div>

        {/* BottomNavigation 고정 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white w-full max-w-[393px]">
          <BottomNavigation />
        </footer>

        {/* ❗송금 미완료 알림 모달 */}
        {isTransferModalOpen && (
          <Modal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            className="w-[350px] h-[140px] px-6 py-6"
          >
            <div className="w-full h-full flex flex-col justify-between items-center">
              <p className="text-[18px] font-normal mt-1 text-black text-center">
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
                className="w-[120px] h-[40px] bg-[#6282E1] text-white text-[18px] rounded-[12px] mt-3"
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

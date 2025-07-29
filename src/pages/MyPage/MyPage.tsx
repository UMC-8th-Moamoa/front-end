import { useState } from 'react';
import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';
import TopBar from '../../components/common/TopBar';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import ProfileCard from '../../components/mypage/ProfileCard';

function MyPage() {
  const [activeMenu, setActiveMenu] = useState<'shopping' | 'heart' | 'home' | 'letter' | 'mypage'>('mypage');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부

  return (
    <>
      {/* TopBar는 고정 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[393px] z-[1000] bg-white">
        <TopBar />
      </div>

      {/* 본문은 TopBar만큼 아래로 */}
      <div className="w-full flex flex-col items-center bg-white pt-[60px] pb-[80px]">
        <div className="w-[393px] mx-auto">
          <ProfileCard />
          <KeywordSection />
          <ParticipationSummary />
          <SettingsList />
        </div>

        {!isModalOpen && (
          <div className="fixed bottom-0 w-full flex justify-center bg-white">
            <div className="w-[393px]">
              <BottomNavigation active={activeMenu} onNavigate={setActiveMenu} />
            </div>
          </div>
        )}

        {isModalOpen && (
          <ProfilePhotoModal
            onClose={() => setIsModalOpen(false)}
            onSelect={(imgUrl) => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default MyPage;


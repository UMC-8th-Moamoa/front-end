import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuType } from '../../components/common/BottomNavigation'; 

import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';
import TopBar from '../../components/common/TopBar';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import ProfileCard from '../../components/mypage/ProfileCard';

function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 라우팅 로직
  const handleNavigate = (menu: MenuType) => {
    switch (menu) {
      case 'shopping':
        navigate('/shopping');
        break;
      case 'heart':
        navigate('/wishlist');
        break;
      case 'home':
        navigate('/home');
        break;
      case 'letter':
        navigate('/moaletter/preview');
        break;
      case 'mypage':
        navigate('/mypage');
        break;
    }
  };

  return (
    <>
      {/* TopBar 고정 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[393px] z-[1000] bg-white">
        <TopBar />
      </div>

      {/* 본문 (TopBar 높이만큼 여백) */}
      <div className="w-full flex flex-col items-center bg-white pt-[60px] pb-[80px]">
        <div className="w-[393px] mx-auto">
          <ProfileCard />
          <KeywordSection />
          <ParticipationSummary />
          <SettingsList />
        </div>

        {/* BottomNavigation */}
        {!isModalOpen && (
          <div className="fixed bottom-0 w-full flex justify-center bg-white">
            <div className="w-[393px]">
              <BottomNavigation active="mypage" onNavigate={handleNavigate} />
            </div>
          </div>
        )}

        {/* 프로필 사진 모달 */}
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

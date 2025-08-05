import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate 추가
import type { MenuType } from '../../components/common/BottomNavigation'; 

import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';
import TopBar from '../../components/common/TopBar';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import ProfileCard from '../../components/mypage/ProfileCard';

function MyPage() {
  const navigate = useNavigate(); // useNavigate 훅
  const [activeMenu, setActiveMenu] = useState<MenuType>('mypage');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 라우팅 로직
  const handleNavigate = (menu: MenuType) => {
    setActiveMenu(menu); // 상태도 업데이트 (UI용)
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
        navigate('/moaletter/write');
        break;
      case 'mypage':
        navigate('/mypage');
        break;
    }
  };

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
              <BottomNavigation active={activeMenu} onNavigate={handleNavigate} />
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

import { useState } from 'react';
import ProfileCard from '../../components/mypage/ProfileCard';
import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';
import TopBar from '../../components/common/TopBar'; 

function MyPage() {
  const [activeMenu, setActiveMenu] = useState<'shopping' | 'heart' | 'home' | 'letter' | 'mypage'>('mypage');

  return (
    <div
      style={{
        maxWidth: '393px',
        margin: '0 auto',
        paddingBottom: '80px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        width: '100vw',
      }}
    >
      {/* TopBar */}
      <TopBar />

      {/* Profile Card */}
      <ProfileCard />

      {/* Keyword Section */}
      <KeywordSection />

      {/* Participation Summary */}
      <ParticipationSummary />

      {/* Settings List */}
      <SettingsList />

      {/* Bottom Navigation */}
      <BottomNavigation active={activeMenu} onNavigate={setActiveMenu} />
    </div>
  );
}

export default MyPage;

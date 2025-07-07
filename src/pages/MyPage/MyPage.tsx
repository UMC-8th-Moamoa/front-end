// src/pages/MyPage/MyPage.tsx

import { useState } from 'react';
import ProfileCard from '../../components/mypage/ProfileCard';
import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';

function MyPage() {
  const [activeMenu, setActiveMenu] = useState<'shopping' | 'heart' | 'home' | 'letter' | 'mypage'>('mypage');

   return (
    <div style={{ maxWidth: '430px', margin: '0 auto', paddingBottom: '80px', backgroundColor: '#FFFFFF', color: '#000000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>MOA MOA</div>
        <img src="/src/assets/Search.svg" alt="검색" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
      </div>

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

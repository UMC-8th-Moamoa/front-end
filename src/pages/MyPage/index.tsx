// src/pages/MyPage/index.tsx

import ProfileCard from '../../components/mypage/ProfileCard';
import KeywordSection from '../../components/mypage/KeywordSection';
import ParticipationSummary from '../../components/mypage/ParticipationSummary';
import SettingsList from '../../components/mypage/SettingsList';
import BottomNavigation from '../../components/common/BottomNavigation';

function MyPage() {
  return (
    <div style={{ width: '375px', margin: '0 auto', paddingBottom: '60px' }}>
      <ProfileCard />
      <KeywordSection />
      <ParticipationSummary />
      <SettingsList />
      <BottomNavigation active="mypage" onNavigate={() => {}} />
    </div>
  );
}

export default MyPage;

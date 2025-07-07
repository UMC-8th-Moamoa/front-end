import { useNavigate } from 'react-router-dom';
import ProfileImageSection from './ProfileImageSection';
import ProfileInfoForm from './ProfileInfoForm';
import BottomNavigation from '../common/BottomNavigation';
import BackButton from '../common/BackButton';


function ProfileEditPage() {
  const navigate = useNavigate();

  return (
    
    <div style={{ maxWidth: '430px', margin: '0 auto', paddingBottom: '80px', backgroundColor: '#FFFFFF', color: '#000000' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '16px' }}>
        <BackButton />
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>프로필 편집</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ProfileImageSection />
      </div>
    <div>
      {/* 기존 코드 유지 */}
    </div>
      <ProfileInfoForm />

      <BottomNavigation active="mypage" onNavigate={() => {}} />
    </div>
  );
}

export default ProfileEditPage;

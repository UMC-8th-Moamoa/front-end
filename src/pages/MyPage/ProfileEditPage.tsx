import { useNavigate } from 'react-router-dom';
import ProfileImageSection from '../../components/mypage/ProfileImageSection';
import ProfileInfoForm from '../../components/mypage/ProfileInfoForm';
import BottomNavigation from '../../components/common/BottomNavigation';
import BackButton from '../../components/common/BackButton';
import React, { useState } from 'react';

function ProfileEditPage() {
  const navigate = useNavigate();

  // 하단 네비게이션 활성화 메뉴 상태 (mypage 유지)
  const [activeMenu, setActiveMenu] = useState<'shopping' | 'heart' | 'home' | 'letter' | 'mypage'>('mypage');

  return (
    <div
      style={{
        maxWidth: '393px',
        margin: '0 auto',
        paddingBottom: '80px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
      }}
    >
      {/* 상단 바 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '16px',
        }}
      >
        <BackButton />
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          프로필 편집
        </div>
      </div>

      {/* 프로필 사진 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ProfileImageSection />
      </div>

      {/* 프로필 정보 입력 폼 */}
      <ProfileInfoForm />

      {/* 하단 네비게이션 */}
      <BottomNavigation
        active={activeMenu}
        onNavigate={(menu) => {
          setActiveMenu(menu);
          switch (menu) {
            case 'home':
              navigate('/home');
              break;
            case 'shopping':
              navigate('/shop');
              break;
            case 'heart':
              navigate('/likes');
              break;
            case 'letter':
              navigate('/letters');
              break;
            case 'mypage':
              navigate('/mypage');
              break;
          }
        }}
      />
    </div>
  );
}

export default ProfileEditPage;

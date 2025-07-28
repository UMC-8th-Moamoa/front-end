import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import MyPage from './pages/MyPage/MyPage';
import ProfileEditPage from './pages/MyPage/ProfileEditPage';
import KeywordEditPage from './pages/MyPage/KeywordEditPage';
import BottomNavigation from './components/common/BottomNavigation';
import type { MenuType } from './components/common/BottomNavigation';
import SettingsPage from './pages/MyPage/SettingsPage';
import CustomerServicePage from './pages/MyPage/CustomerServicePage';
import CustomerServiceWritePage from './pages/MyPage/CustomerServiceWritePage';
import NoticePage from './pages/MyPage/NoticePage';
import PurchaseHistoryPage from './pages/MyPage/PurchaseHistoryPage';
import CustomerServiceDetailPage from './pages/MyPage/CustomerServiceDetailPage';
import OtherUserFollowListPage from './pages/MyPage/OtherUserFollowListPage';
import { useLocation } from 'react-router-dom';
import OtherUserProfilePage from './pages/MyPage/OtherUserProfilePage'; 
import OtherUserWishlistPage from './pages/MyPage/OtherUserWishlistPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* "/"로 들어오면 "/mypage"로 보내기 */}
        <Route path="/" element={<Navigate to="/mypage" />} />

        {/* 전체 레이아웃 적용되는 페이지들 */}
        <Route path="/mypage/*" element={<Layout />} />

        {/* 마이페이지 외부에서 렌더링되는 독립 페이지들 */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/keyword/edit" element={<KeywordEditPage />} />
        <Route path="/user/:id" element={<OtherUserProfilePage />} />
        <Route path="/user/:id/wishlist" element={<OtherUserWishlistPage />} />

      </Routes>
    </Router>
  );
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인

  const handleNavigate = (menu: MenuType) => {
    if (menu === 'home') navigate('/');
    if (menu === 'mypage') navigate('/mypage');
    if (menu === 'shopping') navigate('/shopping');
    if (menu === 'letter') navigate('/moaletter');
    if (menu === 'heart') navigate('/wishlist');
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF] h-screen">
      <div className="w-[393px]">
        <Routes>
          <Route path="" element={<MyPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="customer-service" element={<CustomerServicePage />} />
          <Route path="customer-service/write" element={<CustomerServiceWritePage />} />
          <Route path="customer-service/detail" element={<CustomerServiceDetailPage />} />
          <Route path="notice" element={<NoticePage />} />
          <Route path="purchase-history" element={<PurchaseHistoryPage />} />
          <Route path="follow-list" element={<OtherUserFollowListPage />} />
        </Routes>
      </div>

      {/* 현재 경로가 '/mypage'일 때만 네비게이션 표시 */}
      {location.pathname === '/mypage' && (
        <div className="mt-[1px] w-[393px] fixed bottom-0 z-50 bg-[#FFF]">
          <BottomNavigation active="mypage" onNavigate={handleNavigate} />
        </div>
      )}
    </div>
  );
}


export default App;

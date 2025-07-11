import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MyPage from './pages/MyPage/MyPage';
import ProfileEditPage from './pages/MyPage/ProfileEditPage';
import KeywordEditPage from './pages/MyPage/KeywordEditPage';
import BottomNavigation from './components/common/BottomNavigation';
import type { MenuType } from './components/common/BottomNavigation';
import SettingsPage from './pages/MyPage/SettingsPage';
import BlockedListPage from './pages/MyPage/BlockedListPage';
import CustomerServicePage from './pages/MyPage/CustomerServicePage'; 
import CustomerServiceWritePage from './pages/MyPage/CustomerServiceWritePage'; // ✅ 추가
import NoticePage from './pages/MyPage/NoticePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

function Layout() {
  const navigate = useNavigate();

  // 여기서 타입 지정
const handleNavigate = (menu: MenuType) => {
  if (menu === 'home') navigate('/'); // 홈 페이지
  if (menu === 'mypage') navigate('/mypage'); // 마이페이지로 변경
  if (menu === 'shopping') navigate('/shopping');
  if (menu === 'letter') navigate('/moaletter');
  if (menu === 'heart') navigate('/wishlist');
};

  return (
    <>
      <Routes>
      <Route path="/mypage" element={<MyPage />} /> // 마이페이지 경로 이동
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/keyword/edit" element={<KeywordEditPage />} />
      <Route path="/mypage/settings" element={<SettingsPage />} />
      <Route path="/mypage/blocked" element={<BlockedListPage />} />
      <Route path="/mypage/customer-service" element={<CustomerServicePage />} />
      <Route path="/mypage/customer-service/write" element={<CustomerServiceWritePage />} />
      <Route path="/mypage/notice" element={<NoticePage />} />

      </Routes>
      {/* active는 현재 페이지 기준으로 관리하면 되고, 일단 mypage로 고정 */}
      <BottomNavigation active="mypage" onNavigate={handleNavigate} />
    </>
  );
}

export default App;

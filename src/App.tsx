import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MyPage from './pages/MyPage/MyPage';
import ProfileEditPage from './components/mypage/ProfileEditPage';
import KeywordEditPage from './components/mypage/KeywordEditPage';
import BottomNavigation from './components/common/BottomNavigation';
import type { MenuType } from './components/common/BottomNavigation';

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

  // ✅ 여기서 타입 지정
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

      </Routes>
      {/* active는 현재 페이지 기준으로 관리하면 되고, 일단 mypage로 고정 */}
      <BottomNavigation active="mypage" onNavigate={handleNavigate} />
    </>
  );
}

export default App;

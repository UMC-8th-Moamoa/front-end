import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import BottomNavigation, { type MenuType } from './components/common/BottomNavigation';
import { useLocation } from 'react-router-dom';

// 로그인/회원가입 관련 페이지
import Login from "./pages/Login/Login";
import FindIdPage from "./pages/FindIdPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import SignupNamePage from "./pages/SignUpNamePage";
import SignupBirthdayPage from "./pages/SignUpBirthdayPage";
import SignupSuccessPage from "./pages/SignUpSuccessPage";

// 홈/기능 관련 페이지
import HomePage from "./pages/Home/HomePage";
import WishListPage from "./pages/Wishlist/WishListPage";
import WishListRegisterPage from "./pages/Wishlist/WishListRegisterPage";
import SearchPage from "./pages/Home/SearchPage";
import ParticipationPage from "./pages/Home/ParticipationPage";
import VoteWishPage from "./pages/Home/VoteWishPage";
import MoaCollectedPage from "./pages/Home/MoaCollectedPage";
import PickGiftPage from "./pages/Home/PickGiftPage";
import InputMoaMoneyPage from "./pages/Home/MoaMoney/InputMoaMoneyPage";
import BeforeTransferPage from "./pages/Home/MoaMoney/BeforeTransferPage";
import ReceiveCompletePage from "./pages/Home/MoaMoney/ReceiveCompletePage";
import RemainMoneySelectPage from "./pages/Home/MoaMoney/RemainMoneySelectPage";
import DonationSelectPage from "./pages/Home/MoaMoney/DonationSelectPage";
import DonationToGoodneighborsPage from "./pages/Home/MoaMoney/DonationToGoodneighborsPage";
import ConvertToMongPage from "./pages/Home/MoaMoney/ConvertToMongPage";
import ConvertToMongCompletePage from "./pages/Home/MoaMoney/ConvertToMongCompletePage";
import ReturnToFriendPage from "./pages/Home/MoaMoney/ReturnToFriendPage";
import ReturnToFriendCompletePage from "./pages/Home/MoaMoney/ReturnToFriendCompletePage";
import ReceiveBalancePage from "./pages/Home/MoaMoney/ReceiveBalancePage";
import GiftCertificationPage from "./pages/Home/GiftCertificationPage";
import AlarmPage from "./pages/Home/AlarmPage";
// 쇼핑/결제페이지
import ShoppingList from "./pages/Shopping/ShoppingList";
import PurchasePage from "./pages/Purchase/PurchasePage";
import PaymentMethodPage from "./pages/Purchase/PaymentMethodPage";


// 모아레터 관련 페이지
import WriteLetterPage from "./pages/MoaLetter/WriteLetterPage";
import LetterSavedPage from "./pages/MoaLetter/LetterSavedPage";
import SelectPhotoPage from './pages/MoaLetter/SelectPhotoPage';
import LetterPreviewPage from "./pages/MoaLetter/LetterPreviewPage";
import EnvelopeContent from "./components/moaletter/EnvelopeContent";
import AlbumGridPage from "./pages/MoaLetter/AlbumGridPage"; 
import RollingPaperGridPage from "./pages/MoaLetter/RollingPaperPage";
import ReceiptPage from "./pages/MoaLetter/ReceiptPage";
import LetterDetailPage from './pages/MoaLetter/LetterDetailPage';


// 마이페이지 관련 페이지
import MyPage from './pages/MyPage/MyPage';
import ProfileEditPage from './pages/MyPage/ProfileEditPage';
import KeywordEditPage from './pages/MyPage/KeywordEditPage';
import SettingsPage from './pages/MyPage/SettingsPage';
import CustomerServicePage from './pages/MyPage/CustomerServicePage';
import CustomerServiceWritePage from './pages/MyPage/CustomerServiceWritePage';
import NoticePage from './pages/MyPage/NoticePage';
import PurchaseHistoryPage from './pages/MyPage/PurchaseHistoryPage';
import CustomerServiceDetailPage from './pages/MyPage/CustomerServiceDetailPage';
import OtherUserFollowListPage from './pages/MyPage/OtherUserFollowListPage';
import OtherUserProfilePage from './pages/MyPage/OtherUserProfilePage'; 
import OtherUserWishlistPage from './pages/MyPage/OtherUserWishlistPage';
import SelectRemittancePage from './pages/Home/SelectRemittancePage';


function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const getActiveMenu = (): MenuType => {
    if (location.pathname.startsWith('/wishlist')) return 'heart';
    if (location.pathname.startsWith('/shopping')) return 'shopping';
    if (location.pathname.startsWith('/moaletter')) return 'letter';
    if (location.pathname.startsWith('/mypage')) return 'mypage';
    return 'home';
  };

  // 바텀 네비 숨길 페이지
const excludedPaths = [
  "/moaletter/write",
  "/moaletter/select-photo",
  "/moaletter/album",
  "/moaletter/letter-detail",
  "/moaletter/letter-saved",
  "/moaletter/receipt",
  "/moaletter/rolling-paper",

  "/settings",
  "/purchase-history",
  "/notice",
  "/customer-service",
  "/customer-service/detail",
  "/customer-service/write",
  "/keyword/edit",
  "/profile/edit",
  "/user", 
  "/follow-list",

  "/wishlist-register",
  "/wishlist/register",
  "/moa-collected",
  "/pick-gift",
  "/participation",
];

 
const shouldShowBottomNav = !excludedPaths.some((path) =>
  location.pathname.startsWith(path)
);

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF] h-screen">
      <div className="w-[393px] pb-[70px]">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          
          {/* 로그인/회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/name" element={<SignupNamePage />} />
          <Route path="/signup/birthday" element={<SignupBirthdayPage />} />
          <Route path="/signup/success" element={<SignupSuccessPage />} />

          {/* 마이페이지 외부 */}
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/keyword/edit" element={<KeywordEditPage />} />
          <Route path="/user/:id" element={<OtherUserProfilePage />} />
          <Route path="/user/:id/wishlist" element={<OtherUserWishlistPage />} />

          {/* 마이페이지 내부 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/customer-service/write" element={<CustomerServiceWritePage />} />
          <Route path="/customer-service/detail" element={<CustomerServiceDetailPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
          <Route path="/follow-list" element={<OtherUserFollowListPage />} />

          {/* 홈/기능 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/wishlist-register" element={<WishListRegisterPage />} />
          <Route path="/wishlist/register" element={<WishListRegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/participation" element={<ParticipationPage />} />
          <Route path="/vote-wish" element={<VoteWishPage />} />
          <Route path="/moa-collected" element={<MoaCollectedPage/>} />
          <Route path="/pick-gift" element={<PickGiftPage />} />
          <Route path="/input-moa-money" element={<InputMoaMoneyPage />} />
          <Route path="/before-transfer" element={<BeforeTransferPage />} />
          <Route path="/receive-complete" element={<ReceiveCompletePage />} />
          <Route path="/remain-money-select" element={<RemainMoneySelectPage />} />
          <Route path="/donation-select" element={<DonationSelectPage />} />
          <Route path="/donation-complete-goodneighbors" element={<DonationToGoodneighborsPage />} />
          <Route path="/convert-to-mong" element={<ConvertToMongPage />} />
          <Route path="/convert-to-mong-complete" element={<ConvertToMongCompletePage />} />
          <Route path="/return-to-friend" element={<ReturnToFriendPage />} />
          <Route path="/return-to-friend/return-to-friend-complete" element={<ReturnToFriendCompletePage />} />
          <Route path="/receive-balance" element={<ReceiveBalancePage />} />
          <Route path="/gift-certification" element={<GiftCertificationPage />} />
          <Route path="/alarm" element={<AlarmPage />} />
          <Route path="/select-remittance" element={<SelectRemittancePage />} />

          {/* 모아레터 */}
          <Route path="/moaletter/write" element={<WriteLetterPage />} />
          <Route path="/moaletter/letter-saved" element={<LetterSavedPage />} />
          <Route path="/moaletter/select-photo" element={<SelectPhotoPage />} />
          <Route path="/moaletter/preview" element={<LetterPreviewPage />} />
          <Route path="/moaletter/envelope" element={<EnvelopeContent />} />
          <Route path="/moaletter/album/:albumName" element={<AlbumGridPage />} />
          <Route path="/moaletter/rolling-paper" element={<RollingPaperGridPage />} />
          <Route path="/moaletter/receipt" element={<ReceiptPage />} />
          <Route path="/moaletter/letter-detail" element={<LetterDetailPage />} />

          {/* 쇼핑/결제 */}
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/purchase/payment" element={<PaymentMethodPage />} />
        </Routes>
        
      </div>


{shouldShowBottomNav && (
  <div className="fixed bottom-0 w-full max-w-[393px] z-50">
    <BottomNavigation
      active={getActiveMenu()}
      onNavigate={handleNavigate}
    />
  </div>
        )}
  </div>
  );
}


export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
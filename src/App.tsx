import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Navigate } from "react-router-dom";

// 로그인/회원가입 관련 페이지
import Login from "./pages/Login";
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
import WishListRegisterCompletePage from "./pages/Wishlist/WishListCompletePage";
import SearchPage from "./pages/Home/SearchPage";
import ParticipationPage from "./pages/Home/ParticipationPage";
import VoteWishPage from "./pages/Home/VoteWishPage";
import RecommendWishPage from "./pages/Home/RecommendWishPage";
import MoaCollectedPage from "./pages/Home/MoaCollectPage";
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

// 모아레터 관련 페이지
import WriteLetterPage from "./pages/MoaLetter/WriteLetterPage";
import LetterSavedPage from "./pages/MoaLetter/LetterSavedPage";
import SelectPhotoPage from './pages/MoaLetter/SelectPhotoPage';
import LetterPreviewPage from "./pages/MoaLetter/LetterPreviewPage";
import EnvelopeContent from "./components/moaletter/EnvelopeContent";
import AlbumGridPage from "./pages/MoaLetter/AlbumGridPage"; 
import RollingPaperGridPage from "./pages/MoaLetter/RollingPaperPage";
import ReceiptPage from "./pages/MoaLetter/ReceiptPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 로그인 및 회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/name" element={<SignupNamePage />} />
          <Route path="/signup/birthday" element={<SignupBirthdayPage />} />
          <Route path="/signup/success" element={<SignupSuccessPage />} />

          {/* 홈 및 기타 기능 페이지 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/wishlist-register" element={<WishListRegisterPage />} />
          <Route path="/wishlist/register" element={<WishListRegisterPage />} />
          <Route path="/wishlist/register/complete" element={<WishListRegisterCompletePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/participation" element={<ParticipationPage />} />
          <Route path="/vote-wish" element={<VoteWishPage />} />
          <Route path="/recommend-wish-list" element={<RecommendWishPage />} />
          <Route path="/moa-collected" element={<MoaCollectedPage />} />
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

         {/* 모아레터 페이지 */}
          <Route path="/moaletter/write" element={<WriteLetterPage />} />
          <Route path="/" element={<Navigate to="/moaletter/write" />} />
          <Route path="/moaletter/letter-saved" element={<LetterSavedPage />} />
          <Route path="/moaletter/select-photo" element={<SelectPhotoPage />} />
          <Route path="/moaletter/preview" element={<LetterPreviewPage />} />
          <Route path="/moaletter/envelope" element={<EnvelopeContent />} />
          <Route path="/moaletter/album/:albumName" element={<AlbumGridPage />} />
          <Route path="/moaletter/rolling-paper" element={<RollingPaperGridPage />} />
          <Route path="/moaletter/receipt" element={<ReceiptPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

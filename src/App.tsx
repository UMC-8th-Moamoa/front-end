import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import WishListPage from "./pages/Wishlist/WishListPage";
import './index.css';
import WishListRegisterPage from "./pages/Wishlist/WishListRegisterPage";
import WishListRegisterCompletePage from "./pages/Wishlist/WishListCompletePage";
import SearchPage from "./pages/Home/SearchPage";
import ParticipationPage from "./pages/Home/ParticipationPage";
import VoteWishPage from "./pages/Home/VoteWishPage";
import RecommendWishPage from "./pages/Home/RecommendWishPage";
import MoaCollectedPage from "./pages/Home/MoaCollectPage";
import PickGiftPage from "./pages/Home/PickGiftPage";
import InputMoaMoneyPage from "./pages/Home/InputMoaMoneyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/wishlist" element={<WishListPage />} /> 
        <Route path="/wishlist-register" element={<WishListRegisterPage />} />
        <Route path="/wishlist/register" element={<WishListRegisterPage />} />
        <Route path="/wishlist/register/complete" element={<WishListRegisterCompletePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/participation" element={<ParticipationPage />} />
        <Route path="/vote-wish" element={<VoteWishPage />} />
        <Route path="/recommend-wish-list" element={<RecommendWishPage/>}/>
        <Route path="/moa-collected" element={<MoaCollectedPage />} />
        <Route path="/pick-gift" element={<PickGiftPage />} />
        <Route path="/input-moa-money" element={<InputMoaMoneyPage />} />
      </Routes>
    </Router>
  );
}

export default App;


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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/wishlist" element={<WishListPage />} /> 
        <Route path="/wishlist/register" element={<WishListRegisterPage />} />
        <Route path="/wishlist/register/complete" element={<WishListRegisterCompletePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/participation" element={<ParticipationPage />} />
        <Route path="/vote-wish" element={<VoteWishPage />} />
        <Route path="/recommend-wish-list" element={<RecommendWishPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage"; // 경로 확인해서 맞게 수정!
import WishListPage from "./pages/Wishlist/WishListPage";
import './index.css';
import WishListRegisterPage from "./pages/Wishlist/WishListRegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/wishlist" element={<WishListPage />} /> 
        <Route path="/wishlist/register" element={<WishListRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;


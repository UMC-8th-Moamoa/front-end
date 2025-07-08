import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage"; // 경로 확인해서 맞게 수정!
import WishListPage from "./pages/Wishlist/WishListPage";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/wishlist" element={<WishListPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;


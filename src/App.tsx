import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage"; // 경로 확인해서 맞게 수정!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* 메인 페이지 연결 */}
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import FindIdPage from './pages/FindIdPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import SignupNamePage from './pages/SignUpNamePage';
import SignupBirthdayPage from './pages/SignUpBirthdayPage';
import SignupSuccessPage from './pages/SignUpSuccessPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 회원가입 전체 흐름 */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/name" element={<SignupNamePage />} />
          <Route path="/signup/birthday" element={<SignupBirthdayPage />} />
          <Route path="/signup/Success" element={<SignupSuccessPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
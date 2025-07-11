import { useState } from "react";
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import KakaoIcon from '../assets/Kakao.svg';
import Logo from '../assets/Logo_white.svg';
import { Link } from "react-router-dom";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    // 초기화
    setIdError("");
    setPasswordError("");

    // 아무것도 입력 안 했을 때
    if (!id || !password) {
      setIdError("* 아이디와 비밀번호를 입력해 주세요");
      return;
    }

    // 아이디 불일치 (하드코딩)
    if (id !== "moa123") {
      setShowModal(true);
      return;
    }

    // 비밀번호 불일치 (하드코딩 예시)
    if (password !== "11111111") {
      setPasswordError("* 비밀번호가 일치하지 않습니다");
      return;
    }

    // 로그인 성공 로직
    alert("로그인 성공!");
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between bg-[#B6B6B6]">
      {/* 상단: 로고 및 입력창 */}
      <div className="px-4 pt-20 flex flex-col items-center">
        {/* 로고 */}
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-6" />

        {/* 입력 오류 메시지 (아이디/비번 입력 안 한 경우) */}
        {idError && (
          <p className="text-red-500 text-sm mb-2 self-start px-1">{idError}</p>
        )}

        {/* 아이디 입력 */}
        <InputBox
          type="text"
          placeholder="아이디를 입력해 주세요"
          className="mb-3 placeholder:text-white bg-[rgba(255,255,255,0.2)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          
        />

        {/* 비밀번호 입력 */}
        <InputBox
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          className="mb-3 placeholder:text-white bg-[rgba(255,255,255,0.2)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* 비밀번호 오류 메시지 */}
        {passwordError && (
          <p className="text-red-500 text-sm mb-2 self-start px-1">{passwordError}</p>
        )}

        {/* 로그인 버튼 */}
        <Button variant="secondary" size="medium" width="full" className="mb-3" onClick={handleLogin}>
          로그인
        </Button>

        {/* 카카오 로그인 버튼 */}
        <Button
          variant="kakao"
          size="medium"
          width="full"
          className="flex items-center justify-center gap-2"
        >
          <img src={KakaoIcon} alt="Kakao Icon" className="w-5 h-5" />
          카카오로 시작하기
        </Button>
      </div>

      {/* 하단 */}
     <div className="flex justify-center items-center text-xs text-white mb-25">
      <Link to="/find-id">
        <Button variant="text" size="small" width="fit" className="px-2 font-thin">
        아이디 찾기
        </Button>
      </Link>

      <span>|</span>

      <Link to="/reset-password">
        <Button variant="text" size="small" width="fit" className="px-2 font-thin">
          비밀번호 변경
        </Button>
      </Link>

      <span>|</span>

      <Link to="/signup">
        <Button variant="text" size="small" width="fit" className="px-2 font-thin">
          회원가입
        </Button>
      </Link>
    </div>

      {/* 하단 곡선 배경 */}
      <div className="w-full h-52 bg-white rounded-t-[9999px] -mt-20" />
    
    {/* 모달 */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p className="mb-4">존재하지 않는 아이디입니다</p>
        <Button variant="secondary" size="small" width="full" onClick={() => setShowModal(false)}>
          확인
        </Button>
      </Modal>
    </div>
  );
}

export default Login;
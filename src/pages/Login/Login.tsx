import { useState } from "react";
import InputBox from '../../components/common/InputBox';
import Button from '../../components/common/Button';
import KakaoIcon from '../../assets/Kakao.svg';
import Logo from '../../assets/Logo_white.svg';
import moa from '../../assets/moa_character.svg';
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../components/common/Modal";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // 초기화
    setIdError("");
    setPasswordError("");

    // 아무것도 입력 안 했을 때
    if (!id || !password) {
      setIdError("• 아이디와 비밀번호를 입력해 주세요");
      return;
    }

    // 아이디 불일치 (하드코딩)
    if (id !== "moa123" && id !== "moa111") {
      setShowModal(true);
      return;
    }

    // 비밀번호 불일치 (하드코딩 예시)
    if (password !== "11111111" && password !== "moa1234!") {
      setPasswordError("• 비밀번호가 일치하지 않습니다");
      return;
    }

    // 로그인 성공 로직
    alert("로그인 성공!");
    navigate("/");
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between"
      style={{
        background: 'linear-gradient(169.25deg, #6282E1 1.53%, #FEC3FF 105.97%)',
      }}
    >
      {/* 상단: 로고 및 입력창 */}
      <div className="px-4 pt-20 flex flex-col items-center">
        {/* 로고 */}
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-6" />

        {/* 입력 오류 메시지 (아이디/비번 입력 안 한 경우) */}
        {idError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">{idError}</p>
        )}

        {/* 비밀번호 오류 메시지 */}
        {passwordError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">{passwordError}</p>
        )}

        {/* 아이디 입력 */}
        <InputBox
          type="text"
          placeholder="아이디를 입력해 주세요"
          className="mb-3 placeholder:text-white bg-white/20"
          value={id}
          onChange={(e) => setId(e.target.value)}
          hasBorder={false}
        />

        {/* 비밀번호 입력 */}
        <InputBox
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          className={`mb-3 placeholder:text-white bg-white/20 border ${
            passwordError ? 'border-1 border-[#FF0000]' : 'border-transparent'
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasBorder={false}
          onKeyDown={handleKeyDown}
        />

        {/* 로그인 버튼 */}
        <Button variant="login" fontSize="lg" width="full" className="mb-3 text-[#6282E1]" onClick={handleLogin}>
          로그인
        </Button>

        {/* 카카오 로그인 버튼 */}
        <Button
          variant="kakao"
          size="lg"
          fontWeight="medium"
          fontSize='lg'
          width="full"
          className="flex items-center justify-center gap-2"
        >
          <img src={KakaoIcon} alt="Kakao Icon" className="w-5 h-5" />
          카카오로 시작하기
        </Button>
      </div>

      {/* 하단 */}
     <div className="flex justify-center items-center text-xs text-white mt-8 mb-8">
      <Link to="/find-id">
        <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="px-2">
        아이디 찾기
        </Button>
      </Link>

      <span>|</span>

      <Link to="/reset-password">
        <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="px-2">
         비밀번호 변경
        </Button>
      </Link>

      <span>|</span>

      <Link to="/signup">
        <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="px-2">
         회원가입
        </Button>
      </Link>
    </div>

      {/* 하단 모아 캐릭터 */}
       <img src={moa} alt="Moa Character" />
    
    {/* 모달 */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p className="text-[#1F1F1F]">존재하지 않는 아이디입니다</p>
        <Button variant="primary" size="sm" width="fit" onClick={() => setShowModal(false)} className="mt-6 bg-[#8f8f8f] px-10">
           확인  
        </Button>
      </Modal>
    </div>
  );
}

export default Login;
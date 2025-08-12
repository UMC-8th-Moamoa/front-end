// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputBox from "../../components/common/InputBox";
import Button from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import KakaoIcon from "../../assets/Kakao.svg";
import Logo from "../../assets/Logo_white.svg";
import moa from "../../assets/moa_character.svg";
import api from "../../api/axiosInstance"; 

type SuccessEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

// 로그인 성공시 내려올 수 있는 토큰/유저정보 형태(필요에 따라 수정)
type LoginSuccess = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    user_id: string;
    name: string;
  };
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { user_id?: string } };

  // 가입 완료 → 성공 페이지에서 넘어올 때 아이디 프리필
  const prefilledId = (location.state?.user_id ?? "").trim();

  const [id, setId] = useState(prefilledId);
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("존재하지 않는 아이디입니다");
  const [loading, setLoading] = useState(false);

  // 아이디 입력 시 공백 제거
  const handleChangeId = (v: string) => {
    setId(v.replace(/\s+/g, ""));
  };

  const handleLogin = async () => {
    // 에러 초기화
    setIdError("");
    setPasswordError("");

    const trimmedId = id.trim();
    const trimmedPw = password.trim();

    if (!trimmedId || !trimmedPw) {
      setIdError("• 아이디와 비밀번호를 입력해 주세요");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post<SuccessEnvelope<LoginSuccess>>(
        "/auth/login",
        { user_id: trimmedId, password: trimmedPw }
      );

      if (data.resultType === "SUCCESS") {
        const at = data.success?.accessToken;
        if (at) localStorage.setItem("accessToken", at);

        navigate("/home", { replace: true });
      } else {
        const reason = data.error?.reason || "아이디 또는 비밀번호가 올바르지 않습니다.";
        if (/비밀번호/i.test(reason)) {
          setPasswordError(`• ${reason}`);
        } else if (/아이디|사용자/i.test(reason)) {
          setModalMsg(reason);
          setShowModal(true);
        } else {
          setModalMsg(reason);
          setShowModal(true);
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.reason ||
        err?.message ||
        "로그인 중 오류가 발생했습니다.";
      setModalMsg(msg);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  // 카카오 로그인: 절대주소 사용(배포 환경) 또는 프록시(/api) 사용(로컬)
  const handleKakaoLogin = () => {
    const base = import.meta.env.VITE_API_BASE_URL || ""; // 예: https://www.moamoas.com
    // base 값이 있으면 절대 경로, 없으면 프록시를 통해 '/api' 로 접근
    const url = base ? `${base}/api/auth/kakao` : `/api/auth/kakao`;
    window.location.href = url;
  };

  useEffect(() => {
  }, []);

  return (
    <div
      className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(169.25deg, #6282E1 1.53%, #FEC3FF 105.97%)",
      }}
    >
      {/* 상단: 로고 및 입력창 */}
      <div className="px-4 pt-20 flex flex-col items-center">
        {/* 로고 */}
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-6" />

        {/* 입력 오류 메시지 (아이디/비번 입력 안 한 경우 등) */}
        {idError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">
            {idError}
          </p>
        )}

        {/* 비밀번호 오류 메시지 */}
        {passwordError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">
            {passwordError}
          </p>
        )}

        {/* 아이디 입력 */}
        <InputBox
          type="text"
          placeholder="아이디를 입력해 주세요"
          className="mb-3 placeholder:text-white bg-white/20"
          value={id}
          onChange={(e) => handleChangeId(e.target.value)}
          hasBorder={false}
          onKeyDown={handleKeyDown}
        />

        {/* 비밀번호 입력 */}
        <InputBox
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          className={`mb-3 placeholder:text-white bg-white/20 border ${
            passwordError ? "border-1 border-[#FF0000]" : "border-transparent"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasBorder={false}
          onKeyDown={handleKeyDown}
        />

        {/* 로그인 버튼 */}
        <Button
          variant="login"
          fontSize="lg"
          width="full"
          className="mb-3 text-[#6282E1]"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>

        {/* 카카오 로그인 버튼 */}
        <Button
          variant="kakao"
          size="lg"
          fontWeight="medium"
          fontSize="lg"
          width="full"
          className="flex items-center justify-center gap-2"
          onClick={handleKakaoLogin}
          disabled={loading}
        >
          <img src={KakaoIcon} alt="Kakao Icon" className="w-5 h-5" />
          카카오로 시작하기
        </Button>
      </div>

      {/* 하단 */}
      <div className="flex justify-center items-center text-xs text-white mt-8 mb-8">
        <Link to="/find-id">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="px-2"
          >
            아이디 찾기
          </Button>
        </Link>

        <span>|</span>

        <Link to="/reset-password">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="px-2"
          >
            비밀번호 변경
          </Button>
        </Link>

        <span>|</span>

        <Link to="/signup">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="px-2"
          >
            회원가입
          </Button>
        </Link>
      </div>

      {/* 하단 모아 캐릭터 */}
      <img src={moa} alt="Moa Character" />

      {/* 모달 (에러 메시지) */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p className="text-[#1F1F1F]">{modalMsg}</p>
        <Button
          variant="primary"
          size="sm"
          width="fit"
          onClick={() => setShowModal(false)}
          className="mt-6 bg-[#8f8f8f] px-10"
        >
          확인
        </Button>
      </Modal>
    </div>
  );
}

export default Login;
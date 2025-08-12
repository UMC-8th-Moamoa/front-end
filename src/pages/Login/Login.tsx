// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputBox from "../../components/common/InputBox";
import Button from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import KakaoIcon from "../../assets/Kakao.svg";
import Logo from "../../assets/Logo_white.svg";
import moa from "../../assets/moa_character.svg";
import api from "../../api/axiosInstance"; // 단일 인스턴스

type SuccessEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

// 로그인 성공 시 내려올 수 있는 토큰/유저정보 형태(유연 파싱)
type LoginSuccess = {
  accessToken?: string;
  refreshToken?: string;
  tokens?: { accessToken: string; refreshToken?: string };
  user?: {
    id: number;
    user_id: string;
    name: string;
  };
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { user_id?: string } };

  // 가입 완료 화면에서 넘어올 때 아이디 프리필
  const prefilledId = (location.state?.user_id ?? "").trim();

  const [id, setId] = useState(prefilledId);
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("존재하지 않는 아이디입니다");
  const [loading, setLoading] = useState(false);

  // 공백 제거
  const handleChangeId = (v: string) => setId(v.replace(/\s+/g, ""));

  // 응답에서 토큰 안전 추출
  const extractTokens = (data: any) => {
    const s = data?.success ?? data; // 래퍼/비래퍼 대응
    const at = s?.tokens?.accessToken ?? s?.accessToken ?? null;
    const rt = s?.tokens?.refreshToken ?? s?.refreshToken ?? null;
    return { at, rt };
  };

  // 토큰 저장 + 즉시 헤더 반영
  const saveTokens = (at?: string | null, rt?: string | null) => {
    if (at) localStorage.setItem("accessToken", at);
    if (rt) localStorage.setItem("refreshToken", rt);
    if (at) {
      // 다음 요청부터 바로 사용되도록 기본 헤더 갱신
      (api.defaults.headers as any).common = {
        ...(api.defaults.headers as any).common,
        Authorization: `Bearer ${at}`,
      };
    }
  };

  const handleLogin = async () => {
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
      const { data } = await api.post<SuccessEnvelope<LoginSuccess> | LoginSuccess>(
        "/auth/login",
        { user_id: trimmedId, password: trimmedPw },
        { withCredentials: true } // RT를 쿠키로 받는 경우 유지
      );

      // 성공/실패 분기 (래퍼/비래퍼 모두 대응)
      const resultType = (data as any)?.resultType;
      if (!resultType || resultType === "SUCCESS") {
        const { at, rt } = extractTokens(data);
        if (at) saveTokens(at, rt);
        navigate("/home", { replace: true });
        return;
      }

      // FAIL 케이스
      const reason =
        (data as SuccessEnvelope<LoginSuccess>).error?.reason ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      if (/비밀번호/i.test(reason)) {
        setPasswordError(`• ${reason}`);
      } else if (/아이디|사용자/i.test(reason)) {
        setModalMsg(reason);
        setShowModal(true);
      } else {
        setModalMsg(reason);
        setShowModal(true);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.reason ||
        err?.response?.data?.message ||
        err?.message ||
        "로그인 중 오류가 발생했습니다.";
      setModalMsg(msg);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  // 카카오 로그인: env 기반으로 안전하게 구성 (/api 중복 방지)
  const handleKakaoLogin = () => {
    const base = import.meta.env.VITE_API_BASE_URL || "/api"; // dev: '/api'
    const url = `${String(base).replace(/\/$/, "")}/auth/kakao`;
    window.location.href = url;
  };

  useEffect(() => {
    // 필요 시, 로그인 페이지 진입 시 기존 토큰 제거 등 초기화 로직
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
  }, []);

  return (
    <div
      className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between"
      style={{
        background: "linear-gradient(169.25deg, #6282E1 1.53%, #FEC3FF 105.97%)",
      }}
    >
      {/* 상단: 로고 및 입력창 */}
      <div className="px-4 pt-20 flex flex-col items-center">
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-6" />

        {idError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">{idError}</p>
        )}
        {passwordError && (
          <p className="text-[#FF0000] text-sm mb-2 self-start px-1">{passwordError}</p>
        )}

        <InputBox
          type="text"
          placeholder="아이디를 입력해 주세요"
          className="mb-3 placeholder:text-white bg-white/20"
          value={id}
          onChange={(e) => handleChangeId(e.target.value)}
          hasBorder={false}
          onKeyDown={handleKeyDown}
        />

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

      <img src={moa} alt="Moa Character" />

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

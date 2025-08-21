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
import { setMyUserId } from "../../services/mypage";

/** ---- 공통 타입 (느슨하게) ---- */
type Envelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};
type Tokens = { accessToken?: string; refreshToken?: string };
type LoginSuccess = {
  accessToken?: string;
  refreshToken?: string;
  tokens?: Tokens;
  user?: { id?: number; user_id?: string; name?: string; email?: string };
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { user_id?: string } };

  // 가입 후 넘어오면 아이디 프리필
  const prefilled = (location.state?.user_id ?? "").trim();

  const [id, setId] = useState(prefilled);
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("존재하지 않는 아이디입니다");
  const [loading, setLoading] = useState(false);

  /** 공백 제거 */
  const handleChangeId = (v: string) => setId(v.replace(/\s+/g, ""));

  /** 응답에서 토큰 안전 추출 (래퍼/비래퍼 모두 수용) */
  const extractTokens = (data: any): Tokens => {
    const s = data?.success ?? data;
    return {
      accessToken: s?.tokens?.accessToken ?? s?.accessToken ?? undefined,
      refreshToken: s?.tokens?.refreshToken ?? s?.refreshToken ?? undefined,
    };
  };

  /** 토큰 저장 + axios 기본 헤더 반영 */
  const saveTokens = (t: Tokens) => {
    if (t.accessToken) localStorage.setItem("accessToken", t.accessToken);
    if (t.refreshToken) localStorage.setItem("refreshToken", t.refreshToken);
    if (t.accessToken) {
      (api.defaults.headers as any).common = {
        ...(api.defaults.headers as any).common,
        Authorization: `Bearer ${t.accessToken}`,
      };
    }
  };

  /** 로그인 실행 */
  const handleLogin = async () => {
    setIdError("");
    setPasswordError("");

    const uid = id.trim();
    const pw = password.trim();
    if (!uid || !pw) {
      setIdError("• 아이디와 비밀번호를 입력해 주세요");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post<Envelope<LoginSuccess> | LoginSuccess>(
        "/auth/login",
        { user_id: uid, password: pw },
        { withCredentials: true } // RT 쿠키 운용 시 필요
      );

      // 래퍼/비래퍼 모두 수용
      const resultType = (data as any)?.resultType;
<<<<<<< HEAD
      const ok = !resultType || resultType === "SUCCESS";
      if (ok) {
        const tokens = extractTokens(data);
        saveTokens(tokens);

        const s = (data as any)?.success ?? data;
        const myUid: string | undefined = s?.user?.user_id;
        if (myUid) {
          localStorage.setItem("user_id", myUid);
          setMyUserId(myUid);
=======
      if (!resultType || resultType === "SUCCESS") {
        const { at, rt } = extractTokens(data);
        if (at) saveTokens(at, rt);

        // ✅ 로그인한 사용자의 user_id(문자열) 로컬스토리지에 저장
        const s = (data as any)?.success ?? data;
        if (s?.user?.user_id) {
          localStorage.setItem("user_id", s.user.user_id);
          // 필요하면 표시용 이름/내부 id도 저장
          if (s.user?.name) localStorage.setItem("user_name", s.user.name);
          if (s.user?.id != null) localStorage.setItem("user_numeric_id", String(s.user.id));
          // 디버깅 로그(원하면 남겨두세요)
          // console.log("[LOGIN] user_id saved:", s.user.user_id);
>>>>>>> feat/shopping
        }

        navigate("/home", { replace: true });
        return;
      }

      // FAIL
      const reason =
        (data as Envelope<LoginSuccess>).error?.reason ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      if (/비밀번호/i.test(reason)) setPasswordError(`• ${reason}`);
      else {
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

  /** Enter로 로그인 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  /** 카카오 로그인 시작
   * 백엔드가 카카오와 통신 → 완료 후 프론트의 /auth/callback 으로 리다이렉트(쿼리에 토큰 포함)
   */
  const handleKakaoLogin = () => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
    const returnTo = encodeURIComponent(`${window.location.origin}/auth/callback`);
    // returnTo 파라미터를 백엔드가 받도록 합의되어 있으면 포함, 아니면 제거
    window.location.href = `${apiBase}/auth/kakao?returnTo=${returnTo}`;
    // 합의가 없다면 ↓
    // window.location.href = `${apiBase}/auth/kakao`;
  };

  useEffect(() => {
    // 필요 시 로그인 페이지 진입 시 토큰 초기화
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
  }, []);

  return (
    <div
      className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between"
      style={{ background: "linear-gradient(169.25deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
    >
      {/* 상단: 로고 및 입력창 */}
      <div className="px-4 pt-20 flex flex-col items-center">
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-6" />

        {idError && <p className="text-[#FF0000] text-sm mb-2 self-start px-1">{idError}</p>}
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
        {/* <span>|</span>
        <Link to="/reset-password">
          <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="px-2">
            비밀번호 변경
          </Button>
        </Link> */}
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
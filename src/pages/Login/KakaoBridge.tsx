import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function KakaoBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // 백엔드가 쿼리로 붙여주는 토큰 흡수
  const accessToken  = params.get("accessToken")  || params.get("access_token");
  const refreshToken = params.get("refreshToken") || params.get("refresh_token");

  useEffect(() => {
    const pathname = location.pathname; // /auth/kakao/success or /auth/kakao/complete-profile

    // 토큰이 오면 저장해 두기 (완료/미완료 모두 공통)
    if (accessToken)  localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    // 경로에 따라 분기
    if (pathname.includes("/auth/kakao/success")) {
      // 가입 완료 유저 → 홈으로
      navigate("/home", { replace: true });
      return;
    }

    if (pathname.includes("/auth/kakao/complete-profile")) {
      // 가입 미완료 유저 → 프로필/닉네임 완성 페이지로
      // (프로젝트 내 실제 경로로 바꿔 주세요. 예: /signup/kakao, /signup/complete-profile 등)
      navigate("/signup/complete-profile", { replace: true });
      return;
    }

    // 혹시 다른 경로로 들어오면 로그인으로
    navigate("/login", { replace: true });
  }, [location.pathname]); // eslint-disable-line

  return <div>카카오 로그인 처리 중…</div>;
}

export default KakaoBridge;
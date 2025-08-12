import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      alert("인가 코드가 없습니다.");
      navigate("/login");
      return;
    }

    const handleKakaoLogin = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (!baseUrl) {
          throw new Error("환경변수 VITE_API_BASE_URL이 설정되지 않았습니다.");
        }

        console.log("✅ OAuth 인가 코드:", code);
        console.log("✅ API 호출 URL:", `${baseUrl}/auth/kakao/callback?code=${code}`);

        const res = await fetch(`${baseUrl}/auth/kakao/callback?code=${code}`, {
          method: "GET",
          credentials: "include", // 쿠키 인증 필요 시 유지
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ 서버 응답 오류:", res.status, errorText);
          throw new Error("서버 오류 발생");
        }

        const data = await res.json();
        console.log("✅ 로그인 성공 응답:", data);

        // 응답 데이터에 따라 토큰 키가 다를 수 있음
        const token = data.token || data.access_token;

        if (!token) {
          throw new Error("토큰 정보가 응답에 없습니다.");
        }

        localStorage.setItem("accessToken", token);
        navigate("/");
      } catch (err) {
        console.error("❌ 카카오 로그인 실패:", err);
        alert("로그인 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    handleKakaoLogin();
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthCallback;
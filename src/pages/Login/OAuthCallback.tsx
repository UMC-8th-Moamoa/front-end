import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const code = params.get("code");

    async function finishLogin(at: string | null, rt: string | null) {
      if (at) localStorage.setItem("accessToken", at);
      if (rt) localStorage.setItem("refreshToken", rt);
      // (선택) 여기서 /auth/me 등으로 사용자 정보 동기화 가능
      navigate("/", { replace: true });
    }

    async function exchangeCode(authCode: string) {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) throw new Error("VITE_API_BASE_URL 미설정");

        // 백엔드에 코드 교환 요청
        const url = `${baseUrl}/auth/kakao/callback?code=${encodeURIComponent(authCode)}`;
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("❌ kakao/callback 실패:", res.status, text);
          throw new Error(`callback 실패: ${res.status}`);
        }

        const data = await res.json().catch(() => ({}));

        // 가능한 키 전부 흡수
        const at =
          data?.accessToken ||
          data?.access_token ||
          data?.token ||
          data?.success?.accessToken ||
          data?.success?.token ||
          null;

        const rt =
          data?.refreshToken ||
          data?.refresh_token ||
          data?.success?.refreshToken ||
          null;

        if (!at) throw new Error("응답에 accessToken이 없습니다.");
        await finishLogin(at, rt);
      } catch (e) {
        console.error("❌ 코드 교환 실패:", e);
        alert("로그인 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    }

    (async () => {
      // 1) 토큰이 직접 붙어온 형태
      if (accessToken || refreshToken) {
        await finishLogin(accessToken, refreshToken);
        return;
      }

      // 2) 코드만 있는 형태 → 백엔드에 교환 요청
      if (code) {
        await exchangeCode(code);
        return;
      }

      // 아무 쿼리도 없는 경우
      alert("유효하지 않은 로그인 콜백입니다.");
      navigate("/login", { replace: true });
    })();
  }, [navigate, params]);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthCallback;
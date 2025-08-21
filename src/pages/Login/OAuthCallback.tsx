// src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axiosInstance";

function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    // 해시(#accessToken=...)로 오는 경우도 흡수
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const accessToken =
      params.get("accessToken") ||
      hashParams.get("accessToken") ||
      params.get("access_token") ||
      hashParams.get("access_token");

    const refreshToken =
      params.get("refreshToken") ||
      hashParams.get("refreshToken") ||
      params.get("refresh_token") ||
      hashParams.get("refresh_token");

    const code = params.get("code") || hashParams.get("code");
    const returnTo =
      params.get("returnTo") ||
      hashParams.get("returnTo") ||
      sessionStorage.getItem("oauth:returnTo") ||
      "/";

    function applyTokens(at: string | null, rt: string | null) {
      if (at) {
        localStorage.setItem("accessToken", at);
        // 이후 API 요청 즉시 반영
        (api.defaults.headers as any).common = {
          ...(api.defaults.headers as any).common,
          Authorization: `Bearer ${at}`,
        };
      }
      if (rt) localStorage.setItem("refreshToken", rt);
    }

    async function finishLogin(at: string | null, rt: string | null) {
      applyTokens(at, rt);
      // (옵션) 여기서 /auth/me 등을 호출해 사용자 정보 동기화 가능
      navigate(returnTo || "/", { replace: true });
    }

    async function exchangeCode(authCode: string) {
      try {
        const base =
          (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";
        const apiBase = base.replace(/\/$/, "");
        const url = `${apiBase}/auth/kakao/callback?code=${encodeURIComponent(
          authCode
        )}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "include", // RT 쿠키 운용 시 필요
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("❌ kakao/callback 실패:", res.status, text);
          throw new Error(`callback 실패: ${res.status}`);
        }

        const data = await res.json().catch(() => ({}));

        // 키 다양성 흡수
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
      // 1) 토큰이 직접 쿼리/해시로 붙어온 형태
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params]);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthCallback;
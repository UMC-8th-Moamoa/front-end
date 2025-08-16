import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { donateToOrganization, type DonateResult } from "../../../services/money/moamoney";
import axios from "axios";

type NavState = { organizationId?: number; organizationName?: string };

const DonationCompletePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: NavState };

  const [res, setRes] = useState<DonateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const fallbackName = state?.organizationName ?? "재단";

  const headerText = useMemo(
    () => res?.message ?? `${fallbackName}에\n기부했어요`,
    [res?.message, fallbackName]
  );

  useEffect(() => {
    if (!state?.organizationId) {
      navigate("/donation-select", { replace: true });
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        const result = await donateToOrganization(state.organizationId!, ac.signal);
        setRes(result);
      } catch (e) {
        // 취소는 무시
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        console.error("[donate] error", e);
        setErrMsg("기부 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [state?.organizationId, navigate]);

  const handleConfirm = () => navigate("/");
  const handleGoHome = () => navigate("/");

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-400">처리 중…</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] text-black font-normal mb-2 ml-1 leading-snug whitespace-pre-line">
            {headerText}
          </h1>

          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            {errMsg ?? res?.description ?? "기부금이 전달되면 인증서를 보여 드려요"}
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-[#6282E1] text-white text-[20px] font-medium mt-16 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            확인
          </Button>

          <button
            className="text-[#B7B7B7] text-[14px] mt-8 font-medium self-center"
            onClick={handleGoHome}
          >
            홈으로 가기 &gt;
          </button>
        </div>
      </main>
    </div>
  );
};

export default DonationCompletePage;

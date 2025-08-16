import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { convertToMong, type ConvertResult } from "../../../services/money/moamoney";
import axios from "axios";

const ConvertToMongCompletePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ConvertResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const res = await convertToMong(ac.signal);
        setData(res);
      } catch (e) {
        // StrictMode로 인한 취소는 조용히 무시
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        console.error("[convert] error", e);
        setErrMsg("전환 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const coinsText = useMemo(
    () => (data?.convertedCoins != null ? `${data.convertedCoins}MC` : "-"),
    [data?.convertedCoins]
  );

  const handleConfirm = () => navigate("/"); // 편지 보러가기
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
          <h1 className="text-[32px] mt-10 text-black font-normal mb-2 ml-1 leading-snug">
            <span className="font-bold text-[#6282E1]">
              {data?.message ? data.message.replace(" 전환되었습니다", "") : coinsText}
            </span>
            {data?.message
              ? data.message.endsWith("전환되었습니다")
                ? " 전환되었습니다"
                : ""
              : "로"}
            {!data?.message && (
              <>
                <br />
                전환되었습니다
              </>
            )}
          </h1>

          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            {errMsg ?? data?.description ?? "상점에서 원하는 아이템으로 교환해 보세요"}
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-[#6282E1] text-white text-[20px] font-medium mt-30 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            편지 보러가기
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

export default ConvertToMongCompletePage;

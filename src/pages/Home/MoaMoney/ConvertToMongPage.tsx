import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { getMongPreview, type MongPreview } from "../../../services/money/moamoney";
import axios from "axios";

const ConvertToMongPage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<MongPreview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await getMongPreview(ac.signal);
        setPreview(res);
      } catch (e) {
        // StrictMode의 첫 요청 취소는 무시
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        console.error("[mong preview] error", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // description에서 "18MC" 같은 코인 수 뽑기 (없으면 빈 문자열)
  const coinText = useMemo(() => {
    const desc = preview?.description ?? "";
    const m = desc.match(/([0-9]+)\s*MC/i);
    return m ? `${m[1]}MC` : "";
  }, [preview?.description]);

  const handleConfirm = () => {
    navigate("/convert-to-mong-complete");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-400">불러오는 중…</span>
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
          <h1 className="text-[32px] text-black font-normal mb-2 ml-1 leading-snug">
            <span className="font-bold text-[#6282E1]">몽코인</span>으로 남은<br />
            마음을 바꾸세요!
          </h1>

          {/* API의 안내 문구로 교체 */}
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1 whitespace-pre-line">
            {preview?.message ??
              "전환되는 몽코인은 100원 단위까지 전환되며 나머지 금액은 반올림 되어 적용됩니다"}
          </p>

          {/* "15,000원 = 18MC" 같은 설명이 오니 표시 */}
          {preview?.description && (
            <p className="text-[16px] text-[#1F1F1F] ml-1 mb-4">{preview.description}</p>
          )}

          {/* 우측 상단 코인 표시 → description에서 추출 */}
          <p className="text-[14px] text-black mt-6 w-full text-right">
            전환되는 몽코인: <span className="text-[20px]">{coinText || "-"}</span>
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-[#6282E1] text-white text-[20px] font-medium mt-2 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            전환하기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ConvertToMongPage;

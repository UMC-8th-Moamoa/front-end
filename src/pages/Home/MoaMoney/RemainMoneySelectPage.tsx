import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  getEventRemainingSelection,
  type OptionType,
  type RemainingSelection,
} from "../../../services/money/moamoney";

const RemainMoneySelectPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<RemainingSelection | null>(null);
  const [loading, setLoading] = useState(true);

  const remainingText = useMemo(() => {
    const val = data?.remainingAmount ?? 0;
    return `${val.toLocaleString("ko-KR")}원`;
  }, [data]);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await getEventRemainingSelection(ac.signal);
        setData(res);
      } catch (e) {
        console.error("[remain-money] fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const goByType = (type: OptionType) => {
    switch (type) {
      case "DONATE":
        navigate("/donation-select");
        break;
      case "CONVERT_TO_COIN":
        navigate("/convert-to-mong");
        break;
      default:
        console.warn("Unknown option type:", type);
    }
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

      {/* 본문 중앙 정렬 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] font-bold text-black mb-2 ml-1">
            {remainingText}
            <span className="font-normal">이 남았어요</span>
          </h1>

          <p className="text-[20px] text-gray-400 mb-10 leading-relaxed ml-1 mt-2">
            {data?.description ?? "어떻게 하면 좋을지 선택해 주세요"}
          </p>

          {/* 선택 버튼들 (백엔드가 준 순서대로) */}
          <div className="w-full flex flex-col gap-3">
            {data?.options?.map((opt) => (
              <button
                key={opt.type}
                className="w-full h-[50px] bg-white border border-[#6282E1] text-[#6282E1] rounded-xl text-[20px] font-semibold"
                onClick={() => goByType(opt.type)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RemainMoneySelectPage;

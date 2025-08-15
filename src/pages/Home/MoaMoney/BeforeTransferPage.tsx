// src/pages/Purchase/BeforeTransferPage.tsx (경로는 네 프로젝트 구조에 맞춰 유지)
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { getSettlementFormLink, type SettlementFormLink } from "../../../services/user/mybirthday";

const BeforeTransferPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { amount?: number } };

  // 서버 응답 상태
  const [data, setData] = useState<SettlementFormLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 최초 1회: 구글폼 링크/문구/요약 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getSettlementFormLink();
        setData(res);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "정산 정보를 불러오지 못했어요");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 화면에 크게 보여줄 금액: API가 주면 그것을, 없으면 이전 화면에서 전달된 amount 사용
  const bigAmount = useMemo(() => {
    const apiAmount = data?.paymentSummary?.fundAmount;
    if (typeof apiAmount === "number") return apiAmount;
    return Number(location.state?.amount) || 0;
  }, [data?.paymentSummary?.fundAmount, location.state?.amount]);

  const formattedAmount = useMemo(() => bigAmount.toLocaleString(), [bigAmount]);

  const handleClick = () => {
    // 구글폼 새 탭 열기(있을 때만)
    if (data?.formUrl) window.open(data.formUrl, "_blank");

    // 홈으로 이동 + "송금 대기" 모달 노출(금액 전달)
    navigate("/", {
      state: { showTransferPendingModal: true, amount: bigAmount },
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        불러오는 중…
      </div>
    );
  }
  if (err) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500">
        {err}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      <main className="w-full flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-[393px] px-6 flex flex-col items-center gap-5">
          <h1 className="text-[48px] font-semibold text-left w-full">
            {formattedAmount}원
          </h1>
          <p className="text-[20px] font-normal w-full text-left -mt-5">
            을 송금해 드릴 예정이에요
          </p>

          <p className="text-[20px] mt-4 w-full text-left">
            {data?.message ?? "계좌 송금을 위해 구글폼을 작성해 주세요"}
          </p>
          <p className="text-[14px] text-[#6C6C6C] w-full text-left -mt-3 mb-8">
            입금하는데 시간이 걸릴 수 있습니다
          </p>

          <Button
            size="medium"
            width="large"
            onClick={handleClick}
            className="h-[50px] w-[350px] mt-10 text-[20px]"
            disabled={!data?.formUrl} // 폼 링크 없으면 비활성화
          >
            구글폼으로 가기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BeforeTransferPage;

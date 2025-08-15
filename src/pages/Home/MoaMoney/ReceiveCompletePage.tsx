import { useEffect, useMemo, useState } from "react";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { getEventCompletionStatus } from "../../../services/money/moamoney";

const ReceiveCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 기존 페이지에서 넘어온 금액(백업용)
  const fallbackAmount = location.state?.amount ?? 0;

  const [amount, setAmount] = useState<number>(fallbackAmount);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // 통화 포맷
  const formattedAmount = useMemo(
    () => `${amount.toLocaleString("ko-KR")}원`,
    [amount]
  );

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await getEventCompletionStatus(ac.signal);
        setAmount(res.totalReceivedAmount);
        setRemainingAmount(res.remainingAmount);
        setMessage(res.message);
      } catch (e) {
        // 실패 시 fallbackAmount 그대로 노출
        console.error(e);
      }
    })();
    return () => ac.abort();
  }, [fallbackAmount]);

  const handleConfirm = () => {
    navigate("/remain-money-select", {
      state: { amount: remainingAmount }, // ✅ API의 남은 금액 전달
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 */}
      <main className="w-full flex-grow flex flex-col justify-center items-start px-6 text-left">
        <h1 className="text-[48px] font-semibold text-black mb-2 ml-1">
          {formattedAmount}
        </h1>
        <p className="text-[32px] text-black mb-1 ml-1">
          {message || "친구들의 마음을 받았어요!"}
        </p>
        <p className="text-[14px] text-gray-400 mb-30 ml-2">
          송금 과정에 문제가 있다면 고객센터에 문의해 주세요
        </p>

        <Button
          size="medium"
          width="large"
          className="bg-[#6282E1] text-white text-[20px] font-medium w-[350px] h-[50px]"
          onClick={handleConfirm}
        >
          확인
        </Button>
      </main>
    </div>
  );
};

export default ReceiveCompletePage;

// src/pages/Purchase/InputMoaMoneyPage.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import InputBox from "../../../components/common/InputBox";
import Button from "../../../components/common/Button";
import { participateInEvent } from "../../../services/user/event";

type LocationState = { receiverName?: string };

const InputMoaMoneyPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  const eventId = useMemo(() => {
    const v = Number(sp.get("eventId"));
    return Number.isNaN(v) ? undefined : v;
  }, [sp]);

  // 이름은 우선 state에서, 없으면 쿼리스트링 name으로 폴백
  const receiverName =
    (location.state?.receiverName?.trim?.() as string | undefined) ||
    (sp.get("name") ?? undefined);

  const displayName = receiverName && receiverName.length > 0 ? receiverName : "친구";

  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
    setAmount(onlyNumber);
  };

  const numberAmount = amount ? parseInt(amount, 10) : 0;
  const formattedAmount = amount ? numberAmount.toLocaleString() : "";

  const goPayment = (amt: number) => {
    // 쿼리스트링 + state 모두 사용 → 새로고침에도 안전
    const qs = new URLSearchParams({
      eventId: String(eventId!),
      amount: String(amt),
    }).toString();

    navigate(`/bank-transfer?${qs}`, {
      state: { amount: amt, eventId, receiverName },
      replace: false,
    });
  };

  const handleConfirm = async () => {
    if (!eventId) {
      setErr("eventId가 없습니다.");
      return;
    }
    if (!numberAmount || numberAmount <= 0) {
      setErr("금액을 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setErr(null);

      await participateInEvent(eventId, {
        participationType: "WITH_MONEY",
        amount: numberAmount,
      });

      goPayment(numberAmount);
    } catch (e: any) {
      const s = e?.response?.status;
      const code = e?.response?.data?.error?.errorCode;
      if (s === 401) setErr("로그인이 필요해요.");
      else if (s === 403) setErr("이벤트 참여 권한이 없어요.");
      else if (s === 404) setErr("이벤트를 찾을 수 없어요.");
      else if (s === 400 && code === "B001") setErr("금액을 입력해 주세요.");
      else if (s === 400 && code === "B002") setErr("이미 참여한 이벤트예요.");
      else if (s === 400 && code === "B003") setErr("마감된 이벤트예요.");
      else if (s === 400 && code === "B005")
        setErr("본인의 생일 이벤트에는 참여할 수 없어요.");
      else setErr("참여 처리 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  // Enter로도 제출되게
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !submitting) {
      void handleConfirm();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      <main className="w-full flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-[393px] px-6 flex flex-col items-center gap-5">
          <div className="w-full text-left">
            <h1 className="text-[32px] font-bold text-[#6282E1] leading-snug">
              {displayName}님의 <span className="font-normal text-black">모아모아에</span>
            </h1>
            <h1 className="text-[32px] leading-snug">보탤 금액을 입력해주세요</h1>
            <p className="text-[20px] text-gray-500 mt-7">
              20대는 평균 30,000원의 금액을 보탰어요
            </p>
          </div>

          <InputBox
            type="text"
            inputMode="numeric"
            placeholder="보탤 금액을 입력해 주세요"
            value={formattedAmount}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            hasBorder={false}
            className={`bg-[#E7EDFF] h-[50px] mt-15 px-5 w-[350px]
              ${amount ? "text-[24px] font-bold text-black" : "text-[16px]"}`}
          />

          {err && (
            <div className="w-full max-w-[350px] text-red-500 text-sm">
              {err}
            </div>
          )}

          <Button
            size="medium"
            width="large"
            onClick={handleConfirm}
            className="h-[50px] w-[350px]"
            disabled={submitting}
          >
            {submitting ? "처리 중…" : "확인"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InputMoaMoneyPage;

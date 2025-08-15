// src/pages/SelectRemittancePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";
import SelectRemittance from "../../components/HomePage/Participation/SelectRemittance";
import { getEventParticipationMeta, participateInEvent, type EventParticipationMeta } from "../../services/user/event";


function hmsToSeconds(hms?: string) {
  if (!hms) return 0;
  const [hh, mm, ss] = hms.split(":").map((v) => Number(v) || 0);
  return hh * 3600 + mm * 60 + ss;
}
function secondsToHMS(s: number) {
  const sec = Math.max(0, s);
  const hh = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

type Choice = "remit" | "noRemit";

const SelectRemittancePage = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const location = useLocation() as { state?: { eventId?: number } };

  const eventId = useMemo(() => {
    const fromQS = Number(sp.get("eventId"));
    if (!Number.isNaN(fromQS) && fromQS > 0) return fromQS;
    const fromState = location.state?.eventId;
    return typeof fromState === "number" ? fromState : undefined;
  }, [sp, location.state]);

  const [choice, setChoice] = useState<Choice>("remit");
  const isRemit = choice === "remit";

  const [meta, setMeta] = useState<EventParticipationMeta | null>(null);
  const [remainSec, setRemainSec] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setErr("eventId가 없어요.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getEventParticipationMeta(eventId);
        setMeta(res);
        setRemainSec(hmsToSeconds(res.countdown?.timeRemaining));
      } catch (e: any) {
        const s = e?.response?.status;
        if (s === 401) setErr("로그인이 필요해요.");
        else if (s === 403) setErr("접근 권한이 없어요.");
        else if (s === 404) setErr("이벤트를 찾을 수 없어요.");
        else setErr("참여 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  useEffect(() => {
    if (!remainSec) return;
    const t = setInterval(() => setRemainSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [remainSec]);

  const isExpired =
    (meta && meta.event?.status?.toLowerCase() !== "active") || remainSec <= 0;

  const moaImageSrc = isRemit
    ? "/assets/MoaRemittance.svg"
    : "/assets/MoaNoRemittance.svg";

  const handleConfirm = async () => {
    if (!eventId || isExpired || submitting) return;

    if (isRemit) {
      // ✅ 금액 입력 페이지로 eventId 전달
      navigate(`/input-moa-money?eventId=${eventId}`);
      return;
    }

    // ✅ 송금 없이 참여 즉시 처리
    try {
      setSubmitting(true);
      await participateInEvent(eventId, {
        participationType: "WITHOUT_MONEY",
        amount: 0,
      });
      // 편지 작성은 별도 화면에서 계속
      navigate(`/moaletter/write?eventId=${eventId}`);
    } catch (e: any) {
      const s = e?.response?.status;
      const code = e?.response?.data?.error?.errorCode;
      if (s === 401) setErr("로그인이 필요해요.");
      else if (s === 403) setErr("접근 권한이 없어요.");
      else if (s === 404) setErr("이벤트를 찾을 수 없어요.");
      else if (s === 400 && code === "B002") setErr("이미 참여한 이벤트예요.");
      else if (s === 400 && code === "B003") setErr("마감된 이벤트예요.");
      else if (s === 400 && code === "B005")
        setErr("본인의 생일 이벤트에는 참여할 수 없어요.");
      else setErr("참여 처리에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        불러오는 중…
      </main>
    );
  if (err)
    return (
      <main className="min-h-screen bg-white flex items-center justify-center text-red-500">
        {err}
      </main>
    );

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col relative pb-32">
        <div className="flex items-center w-full px-4 pt-4 pb-2">
          <BackButton />
          <h1 className="flex-1 text-center text-lg font-semibold text-[#1F1F1F] -ml-5">
            모아 참여하기
          </h1>
        </div>

        <div className="w-[350px] mt-7 flex gap-[10px] mx-auto">
          <SelectRemittance
            type="with-money"
            title="송금하고 참여하기"
            subtitle="생일 선물을 위한 돈을 보태요"
            isSelected={isRemit}
            onClick={() => setChoice("remit")}
          />
          <SelectRemittance
            type="without-money"
            title="송금 없이 참여하기"
            subtitle="편지만 작성해 마음을 전해요"
            isSelected={!isRemit}
            onClick={() => setChoice("noRemit")}
          />
        </div>

        <div className="w-full flex justify-center">
          <img
            src={moaImageSrc}
            alt="모아 캐릭터"
            className="w-[350px] max-w-[90%] select-none"
            draggable={false}
          />
        </div>

        <div className="absolute bottom-10 w-full px-4 flex flex-col items-stretch gap-3">
          <div className="w-full text-lg text-black text-left">
            마감 시간 {secondsToHMS(remainSec)}
            {meta?.countdown?.deadlineFormatted
              ? ` ( ${meta.countdown.deadlineFormatted} )`
              : ""}
          </div>

          <Button
            variant="primary"
            width="full"
            size="md"
            onClick={handleConfirm}
            disabled={isExpired || submitting}
          >
            {isExpired ? "마감됨" : submitting ? "처리 중…" : "확인"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SelectRemittancePage;

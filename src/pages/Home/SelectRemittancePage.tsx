// src/pages/SelectRemittancePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";
import SelectRemittance from "../../components/HomePage/Participation/SelectRemittance";
import {
  getBirthdayEventDetail,
  participateInEvent,
  type EventButtonStatus,
} from "../../services/user/event";

// HH:MM:SS ↔ seconds
function secondsToHMS(s: number) {
  const sec = Math.max(0, Math.floor(s));
  const hh = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ✅ 생일(ISO, 연도 무시) -> 마감시각(올해 기준, 이미 지났으면 내년의 전날 23:59)
function calcDeadlineFromBirthday(birthdayISO: string) {
  const now = new Date();
  const b = new Date(birthdayISO); // 월/일만 사용
  const month = b.getMonth();      // 0~11
  const date = b.getDate();        // 1~31

  // 올해 생일 00:00
  let targetYear = now.getFullYear();
  let startOfBirthday = new Date(targetYear, month, date, 0, 0, 0);

  // 이미 그 시각을 지난 경우 → 내년으로
  if (now >= startOfBirthday) {
    targetYear += 1;
    startOfBirthday = new Date(targetYear, month, date, 0, 0, 0);
  }

  // “00:00 1분 전” = 전날 23:59:00
  const deadline = new Date(startOfBirthday.getTime() - 60 * 1000);
  return deadline;
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

  const [buttonInfo, setButtonInfo] = useState<EventButtonStatus | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [remainSec, setRemainSec] = useState(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 상세 조회해서 생일 → 마감시각 계산
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

        const detail = await getBirthdayEventDetail(eventId);
        setButtonInfo(detail.buttonInfo);

        // 생일 기반 마감시각 계산
        const d = calcDeadlineFromBirthday(detail.birthdayPerson.birthday);
        setDeadline(d);

        const now = Date.now();
        setRemainSec(Math.floor((d.getTime() - now) / 1000));
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

  // 1초마다 카운트다운
  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      setRemainSec((prev) => {
        const next = Math.floor((deadline.getTime() - Date.now()) / 1000);
        return next > 0 ? next : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // ✅ “마감시간이 0초 초과”일 때만 참여 가능
  const isExpired = remainSec <= 0;

  const moaImageSrc = isRemit
    ? "/assets/MoaRemittance.svg"
    : "/assets/MoaNoRemittance.svg";

  const handleConfirm = async () => {
    if (!eventId || isExpired || submitting) return;

    if (isRemit) {
      navigate(`/input-moa-money?eventId=${eventId}`);
      return;
    }

    try {
      setSubmitting(true);
      await participateInEvent(eventId, {
        participationType: "WITHOUT_MONEY",
        amount: 0,
      });
      navigate(`/moaletter/write?eventId=${eventId}`);
    } catch (e: any) {
      const s = e?.response?.status;
      const code = e?.response?.data?.error?.errorCode;
      if (s === 401) setErr("로그인이 필요해요.");
      else if (s === 403) setErr("접근 권한이 없어요.");
      else if (s === 404) setErr("이벤트를 찾을 수 없어요.");
      else if (s === 400 && code === "B002") setErr("이미 참여한 이벤트예요.");
      else if (s === 400 && code === "B003") setErr("마감된 이벤트예요.");
      else if (s === 400 && code === "B005") setErr("본인의 생일 이벤트에는 참여할 수 없어요.");
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

  // 표시용 포맷 (예: 08-16 23:59 → 연도 제외!)
  const deadlineText =
    deadline
      ? `${String(deadline.getMonth() + 1).padStart(2, "0")}-${String(
          deadline.getDate()
        ).padStart(2, "0")} ${String(deadline.getHours()).padStart(2, "0")}:${String(
          deadline.getMinutes()
        ).padStart(2, "0")}`
      : "";

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
            {deadlineText ? ` ( ${deadlineText} )` : ""}
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

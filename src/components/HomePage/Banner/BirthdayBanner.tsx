// src/components/HomePage/BirthdayBanner.tsx
import { useEffect, useState } from "react";
import { getMyBirthdayCountdown } from "../../../services/user/friendbirthday";

// 유틸들
function calcDaysUntilNext(md: { month: number; day: number }): number {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(today0.getFullYear(), md.month - 1, md.day);
  if (target < today0) {
    target = new Date(today0.getFullYear() + 1, md.month - 1, md.day);
  }
  const diff = target.getTime() - today0.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}
function monthDayFromISO(s?: string | null): { month: number; day: number } | null {
  if (!s) return null;
  const m = /^\s*\d{4}[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
  if (m) {
    const mm = +m[1], dd = +m[2];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
  return null;
}

const BirthdayBanner = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await getMyBirthdayCountdown();

        setName(res.user?.name ?? "");

        // ✅ 생일 날짜 후보들 (API 스키마 변화 대비 넉넉하게 탐색)
        const birthdayISO: string | undefined =
          res.user?.birthday ??
          res.countdown?.birthday ??
          res.countdown?.targetDate ??
          res.countdown?.nextBirthdayDate ??
          res.countdown?.date ??
          undefined;

        // 1) 월/일 파싱에 성공하면 로컬 계산 우선
        const md = monthDayFromISO(birthdayISO);
        if (md) {
          setDday(calcDaysUntilNext(md));
        } else {
          // 2) 폴백: 서버 제공값 사용
          const serverToday = !!res.countdown?.isBirthdayToday;
          const serverRemain = Number(res.countdown?.daysRemaining ?? NaN);
          setDday(serverToday ? 0 : (Number.isFinite(serverRemain) ? serverRemain : null));
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 400) setErr("프로필에 생일 정보를 먼저 등록해 주세요.");
        else if (status === 401) setErr("로그인이 필요해요.");
        else setErr("생일 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="w-[350px] h-[81px] mt-[20px] mx-auto rounded-2xl bg-gray-100 animate-pulse" />
    );
  }
  if (err || dday === null) {
    return null;
  }

  return (
    <div className="w-[350px] h-[81px] mt-[20px] mx-auto flex items-center justify-center bg-gradient-to-r from-[#94B2F5] to-[#FFFFFF] rounded-2xl">
      <div className="flex-1 flex items-center justify-center text-4xl font-bold text-white">
        {dday === 0 ? "D-DAY" : `D-${dday}`}
      </div>
      <div className="w-px h-6 bg-white mx-2" />
      <div className="flex-1 flex items-center justify-center text-lg text-[#6282E1]">
        <span className="font-bold">{name}님</span>의 생일
      </div>
    </div>
  );
};

export default BirthdayBanner;

// components/HomePage/List/Birthday/UpcomingFriendList.tsx
import { useEffect, useRef, useState } from "react";
import UpcomingFriendItem from "./UpcomingFriendItem";
import {
  getUpcomingBirthdays,
  type UpcomingFriend,
} from "../../../../services/user/friendbirthday";

const PAGE_SIZE = 3;       // 페이지당 3개 고정
const INTERVAL_MS = 5000;  // 5초마다 다음 페이지
const MAX_COLLECT = 60;    // 한 번 로딩 때 최대 수집(여유치)

function parseMonthDayFromDisplay(s: string): { month: number; day: number } | null {
  const m = String(s ?? "").match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (!m) return null;
  const month = +m[1], day = +m[2];
  if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
  return null;
}

function calcDaysUntilNextBirthday(md: { month: number; day: number }): number {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  let target = new Date(now.getFullYear(), md.month - 1, md.day, 0, 0, 0, 0);
  if (target < today0) target = new Date(now.getFullYear() + 1, md.month - 1, md.day, 0, 0, 0, 0);
  const diffMs = target.getTime() - today0.getTime();
  return Math.max(0, Math.floor(diffMs / 86400000));
}

// D-7 ~ D-DAY(당일 21:00까지)만 통과
function isWithinWindow(displayDate: string): boolean {
  const md = parseMonthDayFromDisplay(displayDate);
  if (!md) return false;

  const now = new Date();
  const d = calcDaysUntilNextBirthday(md);

  if (d > 7) return false;        // 7일 초과 제외
  if (d >= 1) return true;        // D-1 ~ D-7 통과

  // d === 0 (당일) → 21:00 이전까지만 통과
  const birthday21 = new Date(now.getFullYear(), md.month - 1, md.day, 21, 0, 0, 0);
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  if (birthday21.getTime() < today0.getTime()) {
    birthday21.setFullYear(now.getFullYear() + 1);
  }
  return now.getTime() < birthday21.getTime();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const UpcomingFriendList = () => {
  // pages: 3개씩 끊은 페이지 배열
  const [pages, setPages] = useState<UpcomingFriend[][]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);

  // 한 번에 윈도우 범위 항목을 충분히 모아서 페이지로 쪼갠다
  const loadAllPages = async () => {
    try {
      setInitialLoading(true);
      setErr(null);

      const collected: UpcomingFriend[] = [];
      let cursor: string | null = null;

      for (let hop = 0; hop < 50; hop++) {
        const res = await getUpcomingBirthdays({
          limit: PAGE_SIZE, // 백엔드 페이지 크기: 작아도 hop으로 누적 수집
          cursor,
          direction: "next",
        });

        const filtered = (res.upcomingBirthdays || []).filter((u) =>
          isWithinWindow(u.birthday.displayDate)
        );

        for (const it of filtered) {
          if (collected.length >= MAX_COLLECT) break;
          collected.push(it);
        }

        const next = res.pagination?.nextCursor ?? null;
        if (!next || collected.length >= MAX_COLLECT) break;
        cursor = next;
      }

      // 3개씩 페이지화
      const paged = chunk(collected, PAGE_SIZE);
      setPages(paged);
      setPageIndex(0);
    } catch {
      setErr("다가오는 생일을 불러오지 못했어.");
      setPages([]);
      setPageIndex(0);
    } finally {
      setInitialLoading(false);
    }
  };

  // 최초 로드
  useEffect(() => {
    loadAllPages();
  }, []);

  // 5초마다 다음 페이지로
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pages.length <= 1) return; // 페이지가 1개 이하면 굳이 돌리지 않음

    intervalRef.current = window.setInterval(() => {
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [pages.length]);

  // 로딩/에러/빈값 처리
  if (initialLoading) {
    return <section className="mt-[30px] px-4 text-sm text-[#97B1FF]">불러오는 중…</section>;
  }
  if (err) {
    return <section className="mt-[30px] px-4 text-sm text-red-600">{err}</section>;
  }
  if (pages.length === 0) return null;

  const current = pages[Math.min(pageIndex, Math.max(0, pages.length - 1))];
  const dotCount = pages.length;
  const activeDot = Math.min(pageIndex, dotCount - 1);

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        다가오는 친구의 생일
      </h2>

      <div className="flex flex-col gap-[1px]">
        {current.map((item) => (
          <UpcomingFriendItem
            key={`${item.friend.id}-${item.birthday.date}`}
            name={item.friend.name}
            displayDate={item.birthday.displayDate}
            dday={item.birthday.dDay}
            image={item.friend.photo}
            eventId={(item as any).eventId ?? (item as any).event?.id ?? null}
          />
        ))}
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center space-x-[6px] mt-2">
        {Array.from({ length: dotCount }).map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeDot ? "bg-[#97B1FF]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default UpcomingFriendList;

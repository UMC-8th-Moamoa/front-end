// components/HomePage/List/Birthday/FriendLetterList.tsx
import { useEffect, useRef, useState } from "react";
import FriendLetterItem from "./FriendLetterItem";
import { getLetterHome, type LetterHomeItem } from "../../../../services/user/friendbirthday";

const PAGE_SIZE = 3;        // 한 화면에 항상 3개 채움
const INTERVAL_MS = 5000;   // 5초마다 자동 순환
const MAX_COLLECT = 60;     // 한 번 로딩 때 최대 수집(여유치)

/** ---- 날짜 유틸: 문자열/타임스탬프 → {month, day} ---- */
function parseMonthDay(input: unknown): { month: number; day: number } | null {
  if (input == null) return null;

  if (typeof input === "number") {
    const d = new Date(input);
    if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
    return null;
  }

  const s = String(input).trim();
  if (!s) return null;

  let m = s.match(/^\s*\d{4}[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return { month: +m[1], day: +m[2] };

  m = s.match(/^\s*(\d{1,2})[-/.](\d{1,2})\s*$/);
  if (m) return { month: +m[1], day: +m[2] };

  m = s.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (m) return { month: +m[1], day: +m[2] };

  m = s.match(/^\s*(\d{4})(\d{2})(\d{2})\s*$/);
  if (m) return { month: +m[2], day: +m[3] };

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
  return null;
}

/** 오늘 0시 기준 다음 생일까지 남은 ‘정수 일수’ */
function daysUntilNextBirthday(md: { month: number; day: number }): number {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  let target = new Date(now.getFullYear(), md.month - 1, md.day, 0, 0, 0, 0);
  if (target < today0) target = new Date(now.getFullYear() + 1, md.month - 1, md.day, 0, 0, 0, 0);
  const diffMs = target.getTime() - today0.getTime();
  return Math.max(0, Math.floor(diffMs / 86400000));
}

/** D-7 ~ D-DAY(당일 21:00까지)만 통과 */
function isWithinWindow(birthday: string | number): boolean {
  const md = parseMonthDay(birthday);
  if (!md) return false;

  const d = daysUntilNextBirthday(md);
  if (d > 7) return false;
  if (d >= 1) return true; // D-1 ~ D-7

  // d === 0 → 오늘 21:00 전까지만
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), md.month - 1, md.day, 21, 0, 0, 0);
  return now.getTime() < cutoff.getTime();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const FriendLetterList = () => {
  // 3개씩 끊은 페이지 배열
  const [pages, setPages] = useState<LetterHomeItem[][]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);

  // 한 번에 충분히 모아 페이지로 쪼개기
  const loadAllPages = async () => {
    try {
      setInitialLoading(true);
      setErr(null);

      const collected: LetterHomeItem[] = [];
      let cursor: string | null = null;

      // 커서를 따라가며 MAX_COLLECT 만큼 수집
      for (let hop = 0; hop < 50; hop++) {
        const res = await getLetterHome({
          limit: PAGE_SIZE,     // 백엔드 페이지 크기는 작아도 hop으로 누적 수집
          cursor,
          direction: "next",
        });

        const filtered = (res.letters || []).filter((it) => isWithinWindow(it.birthday));

        for (const it of filtered) {
          if (collected.length >= MAX_COLLECT) break;
          collected.push(it);
        }

        const next = res.pagination?.nextCursor ?? null;
        if (!next || collected.length >= MAX_COLLECT) break;
        cursor = next;
      }

      const paged = chunk(collected, PAGE_SIZE);
      setPages(paged);
      setPageIndex(0);
    } catch {
      setErr("편지 목록을 불러오지 못했어요.");
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

  // 5초마다 다음 페이지로 자동 순환
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pages.length <= 1) return; // 페이지 1개 이하면 순환 불필요

    intervalRef.current = window.setInterval(() => {
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [pages.length]);

  // 로딩/에러/비어 있음 처리
  if (initialLoading) return <section className="mt-[30px] px-4">불러오는 중…</section>;
  if (err) return <section className="mt-[30px] px-4 text-red-600">{err}</section>;
  if (pages.length === 0) return null; // 필터링 후 항목 0개면 섹션 숨김

  const current = pages[Math.min(pageIndex, Math.max(0, pages.length - 1))];
  const dotCount = pages.length;
  const activeDot = Math.min(pageIndex, dotCount - 1);

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        친구에게 줄 편지
      </h2>

      <div className="flex flex-col gap-[16px]">
        {current.map((it) => (
          <FriendLetterItem
            key={it.birthdayEventId}
            name={it.birthdayPersonName}
            birthday={it.birthday}
            daysLeft={it.daysLeft}
            hasLetter={it.hasLetter}
            letterId={it.letterId}
            eventId={it.birthdayEventId}
          />
        ))}
      </div>

      {/* dot 인디케이터 */}
      <div className="flex justify-center space-x-[6px] mt-3">
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

export default FriendLetterList;

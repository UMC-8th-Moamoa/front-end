import { useEffect, useRef, useState } from "react";
import FriendLetterItem from "./FriendLetterItem";
import { getLetterHome, type LetterHomeItem } from "../../../../services/user/friendbirthday";

const LIMIT = 3;

const FriendLetterList = () => {
  const [items, setItems] = useState<LetterHomeItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const pagesSeenRef = useRef<number>(1);

  const load = async ({
    cursor = null,
    direction = "next" as "next" | "prev",
    showSkeleton = false,
  } = {}) => {
    try {
      if (showSkeleton) setInitialLoading(true);
      const res = await getLetterHome({ limit: LIMIT, cursor, direction });

      let newIndex = pageIndex;
      if (cursor) newIndex = direction === "next" ? pageIndex + 1 : Math.max(0, pageIndex - 1);
      else newIndex = 0;

      setItems(res.letters);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);
      setPageIndex(newIndex);

      const totalCount = res.pagination.totalCount;
      if (typeof totalCount === "number" && totalCount >= 0) {
        const pages = Math.max(1, Math.ceil(totalCount / LIMIT));
        setTotalPages(pages);
        pagesSeenRef.current = Math.max(pagesSeenRef.current, pages);
      } else {
        const atLeast = newIndex + 1 + (res.pagination.nextCursor ? 1 : 0);
        pagesSeenRef.current = Math.max(pagesSeenRef.current, atLeast, 1);
        setTotalPages(pagesSeenRef.current);
      }

      setErr(null);
    } catch {
      setErr("편지 목록을 불러오지 못했어요.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    load({ showSkeleton: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      if (nextCursor) load({ cursor: nextCursor, direction: "next" });
      else load({ cursor: null, direction: "next" });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor]);

  // 로딩/에러 처리
  if (initialLoading) {
    return <section className="mt-[30px] px-4">불러오는 중…</section>;
  }
  if (err) {
    return <section className="mt-[30px] px-4 text-red-600">{err}</section>;
  }
  // ✅ 아이템이 하나도 없으면 섹션 자체를 숨김
  if (items.length === 0) return null;

  const dotCount = Math.max(1, totalPages);

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        친구에게 줄 편지
      </h2>

      <div className="flex flex-col gap-[16px]">
        {items.map((it) => (
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

      {/* 인디케이터 */}
      <div className="flex justify-center space-x-[6px] mt-3">
        {Array.from({ length: dotCount }).map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === pageIndex ? "bg-[#97B1FF]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default FriendLetterList;

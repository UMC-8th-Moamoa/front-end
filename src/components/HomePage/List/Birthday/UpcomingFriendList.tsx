import { useEffect, useRef, useState } from "react";
import UpcomingFriendItem from "./UpcomingFriendItem";
import {
  getUpcomingBirthdays,
  type UpcomingFriend,
} from "../../../../services/user/friendbirthday";

const PAGE_SIZE = 3;
const INTERVAL_MS = 5000;

const UpcomingFriendList = () => {
  const [items, setItems] = useState<UpcomingFriend[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
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
      setErr(null);

      const res = await getUpcomingBirthdays({
        limit: PAGE_SIZE,
        cursor,
        direction,
      });

      let nextIndex = pageIndex;
      if (cursor) nextIndex = direction === "next" ? pageIndex + 1 : Math.max(0, pageIndex - 1);
      else nextIndex = 0;

      setItems(res.upcomingBirthdays);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);
      setPageIndex(nextIndex);

      const totalCount = (res.pagination as any)?.totalCount;
      if (typeof totalCount === "number") {
        const pages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
        setPageCount(pages);
        pagesSeenRef.current = Math.max(pagesSeenRef.current, pages);
      } else {
        const atLeast = nextIndex + 1 + (res.pagination.nextCursor ? 1 : 0);
        pagesSeenRef.current = Math.max(pagesSeenRef.current, atLeast, 1);
        setPageCount(pagesSeenRef.current);
      }
    } catch {
      setErr("다가오는 생일을 불러오지 못했어.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    load({ showSkeleton: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (nextCursor) load({ cursor: nextCursor, direction: "next" });
      else load({ cursor: null, direction: "next" });
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor]);

  // 로딩/에러 처리
  if (initialLoading) {
    return <section className="mt-[30px] px-4 text-sm text-[#97B1FF]">불러오는 중…</section>;
  }
  if (err) {
    return <section className="mt-[30px] px-4 text-sm text-red-600">{err}</section>;
  }
  // ✅ 아이템이 하나도 없으면 섹션 자체를 숨김
  if (items.length === 0) return null;

  const dotCount = Math.max(1, pageCount);
  const activeDot = Math.min(pageIndex, dotCount - 1);

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        다가오는 친구의 생일
      </h2>

      <div className="flex flex-col gap-[1px]">
        {items.map((item) => (
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

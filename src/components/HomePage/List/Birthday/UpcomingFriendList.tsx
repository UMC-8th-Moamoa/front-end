// components/HomePage/List/Birthday/UpcomingFriendList.tsx
import { useEffect, useState } from "react";
import UpcomingFriendItem from "./UpcomingFriendItem";
import {
  getUpcomingBirthdays,
  type UpcomingFriend,
} from "../../../../services/user/friendbirthday";

const LIMIT = 3;

const UpcomingFriendList = () => {
  const [items, setItems] = useState<UpcomingFriend[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // dot 인디케이터용
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // 최소 1

  const load = async (
    cursor?: string | null,
    direction: "next" | "prev" = "next"
  ) => {
    try {
      setLoading(true);
      setErr(null);

      const res = await getUpcomingBirthdays({
        limit: LIMIT,
        cursor: cursor ?? null,
        direction,
      });

      setItems(res.upcomingBirthdays);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);

      // 처음 로드일 땐 인덱스 0 고정, 커서 있을 때만 이동
      if (cursor) {
        if (direction === "next") setPageIndex((p) => p + 1);
        else if (direction === "prev") setPageIndex((p) => Math.max(0, p - 1));
      } else {
        setPageIndex(0);
      }

      // 전체 페이지 수 계산 (totalCount 있으면 사용)
      const totalCount = (res.pagination as any).totalCount;
      if (typeof totalCount === "number") {
        setTotalPages(Math.max(1, Math.ceil(totalCount / LIMIT)));
      } else {
        setTotalPages(1); // 정보 없으면 1페이지로
      }
    } catch {
      setErr("다가오는 생일을 불러오지 못했어.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); // 최초 로드
  }, []);

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        다가오는 친구의 생일
      </h2>

      {loading ? (
        <div className="text-sm text-[#97B1FF] py-2">불러오는 중…</div>
      ) : err ? (
        <div className="text-sm text-red-600 py-2">{err}</div>
      ) : (
        <>
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

          {/* dot 인디케이터: 최소 1개 */}
          <div className="flex justify-center space-x-[6px]">
            {Array.from({ length: Math.max(1, totalPages) }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === pageIndex ? "bg-[#97B1FF]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default UpcomingFriendList;

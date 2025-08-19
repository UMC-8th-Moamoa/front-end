// components/HomePage/List/Birthday/FriendLetterList.tsx
import { useEffect, useState } from "react";
import FriendLetterItem from "./FriendLetterItem";
import { getLetterHome, type LetterHomeItem } from "../../../../services/user/friendbirthday";

const LIMIT = 3;

const FriendLetterList = () => {
  const [items, setItems] = useState<LetterHomeItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // 최소 1페이지

  const load = async (cursor?: string | null, direction: "next" | "prev" = "next") => {
    try {
      setLoading(true);
      const res = await getLetterHome({ limit: LIMIT, cursor: cursor ?? null, direction });

      setItems(res.letters);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);

      // (1) 페이지 인덱스: 처음 로드는 0 고정, cursor가 있을 때만 이동
      if (cursor) {
        if (direction === "next") setPageIndex((p) => p + 1);
        else if (direction === "prev") setPageIndex((p) => Math.max(0, p - 1));
      } else {
        setPageIndex(0);
      }

      // (2) 전체 페이지 수 계산
      const totalCount = res.pagination.totalCount;
      if (typeof totalCount === "number") {
        setTotalPages(Math.max(1, Math.ceil(totalCount / LIMIT)));
      } else {
        // totalCount가 없으면 최소 1페이지로
        setTotalPages(1);
      }

      setErr(null);
    } catch (e: any) {
      setErr("편지 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); // 초기 로드 (cursor 없음)
  }, []);

  if (loading) return <section className="mt-[30px] px-4">불러오는 중…</section>;
  if (err) return <section className="mt-[30px] px-4 text-red-600">{err}</section>;

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

      {/* dot 인디케이터: 최소 1개 */}
      <div className="flex justify-center space-x-[6px] mt-3">
        {Array.from({ length: Math.max(1, totalPages) }).map((_, idx) => (
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

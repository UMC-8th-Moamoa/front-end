// components/HomePage/List/Birthday/FriendLetterList.tsx
import { useEffect, useState } from "react";
import FriendLetterItem from "./FriendLetterItem";
import { getLetterHome, type LetterHomeItem } from "../../../../services/user/friendbirthday";


const FriendLetterList = () => {
  const [items, setItems] = useState<LetterHomeItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async (cursor?: string | null, direction: "next" | "prev" = "next") => {
    try {
      setLoading(true);
      const res = await getLetterHome({ limit: 3, cursor: cursor ?? null, direction });
      setItems(res.letters);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);
      setErr(null);
    } catch (e: any) {
      setErr("편지 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); // 최초 로드
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

      {/* 필요하면 스와이프 대신 버튼 페이징 */}
      <div className="flex justify-between mt-3">
        <button
          disabled={!prevCursor}
          onClick={() => load(prevCursor, "prev")}
          className="text-sm underline disabled:opacity-30"
        >
          이전
        </button>
        <button
          disabled={!nextCursor}
          onClick={() => load(nextCursor, "next")}
          className="text-sm underline disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </section>
  );
};

export default FriendLetterList;

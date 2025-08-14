import { useEffect, useState } from "react";
import UpcomingFriendItem from "./UpcomingFriendItem";
import { getUpcomingBirthdays, type UpcomingFriend } from "../../../../services/birthday/friendbirthday";

const UpcomingFriendList = () => {
  const [items, setItems] = useState<UpcomingFriend[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async (cursor?: string | null, direction: "next" | "prev" = "next") => {
    try {
      setLoading(true);
      setErr(null);
      const res = await getUpcomingBirthdays({ limit: 3, cursor: cursor ?? null, direction });
      setItems(res.upcomingBirthdays);
      setNextCursor(res.pagination.nextCursor);
      setPrevCursor(res.pagination.prevCursor);
    } catch (e) {
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
          {items.map((item) => (
            <UpcomingFriendItem
              key={`${item.friend.id}-${item.birthday.date}`}
              name={item.friend.name}
              displayDate={item.birthday.displayDate}
              dday={item.birthday.dDay}
              image={item.friend.photo}
              eventId={item.eventId}
            />
          ))}

          {/* 좌우 스와이프 대신 간단 버튼 페이징 (원하면 숨겨도 됨) */}
          <div className="flex justify-between mt-2">
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
        </>
      )}
    </section>
  );
};

export default UpcomingFriendList;

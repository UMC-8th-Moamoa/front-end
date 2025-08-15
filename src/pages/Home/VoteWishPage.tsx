import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import VoteWishContainer from "../../components/HomePage/Vote/VoteWishContainer";
import { getWishlistForVote } from "../../services/wishlist/vote";

const VoteWishPage = () => {
  const [searchParams] = useSearchParams();
  const eventId = useMemo(
    () => Number(searchParams.get("eventId")) || 0,
    [searchParams]
  );

  const [ownerName, setOwnerName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!eventId) return;
      try {
        setLoading(true);
        const res = await getWishlistForVote(eventId);
        if (ignore) return;
        setOwnerName(res.event?.birthdayPersonName ?? "");
      } catch {
        if (!ignore) setOwnerName("");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [eventId]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* 상단 헤더 */}
      <div className="w-full px-4 pt-[9px] flex items-center justify-between max-w-[430px] mx-auto">
        <BackButton />
        <h1 className="text-[18px] font-semibold text-black text-center flex-1">
          {loading
            ? "불러오는 중…"
            : ownerName
            ? `${ownerName}님의 위시리스트`
            : "위시리스트"}
        </h1>
        <div className="w-[40px] h-[40px]" />
      </div>

      {/* 투표 위시 리스트 */}
      <div className="w-full px-4 max-w-[430px] mt-4">
        <VoteWishContainer />
      </div>
    </div>
  );
};

export default VoteWishPage;

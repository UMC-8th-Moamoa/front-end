import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VoteWishList from "./VoteWishList";
import VoteWishResult from "./VoteWishResult";
import {
  getWishlistForVote,
  submitWishlistVote,
  getWishlistVoteResults,
  toUiItems,
  type VoteUiItem,
  type VoteResultsItem,
} from "../../../services/wishlist/vote";

const VoteWishContainer = () => {
  const [searchParams] = useSearchParams();
  const eventId = useMemo(
    () => Number(searchParams.get("eventId")) || 0,
    [searchParams]
  );

  const [items, setItems] = useState<VoteUiItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<VoteResultsItem[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 목록 불러오기
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!eventId) {
        setErr("eventId가 없습니다.");
        return;
      }
      try {
        setErr(null);
        setLoading(true);
        const res = await getWishlistForVote(eventId);

        // 디버깅 도움 (필요 시 확인)
        // console.table(res.wishlists.map((w: any) => ({
        //   id: w.id, wishlistId: w.wishlistId, itemId: w.itemId, name: w.name
        // })));

        if (ignore) return;
        const mapped = toUiItems(res.wishlists);
        setItems(mapped);
      } catch (e: any) {
        if (ignore) return;
        setErr(e?.response?.data?.message || e?.message || "목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [eventId]);

  const handleVote = async () => {
    if (!eventId || selectedId == null) return;
    try {
      setLoading(true);
      setErr(null);

      // 단일 선택(스펙상 배열로 전달)
      await submitWishlistVote(eventId, [selectedId]);

      // 결과 조회
      const r = await getWishlistVoteResults(eventId);
      setResults(r.results);
      setHasVoted(true);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "투표에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="w-full max-w-[350px] mx-auto flex flex-col items-center pt-[10px]">
      {/* 타이틀 */}
      <h2 className="text-[18px] font-semibold text-[#6282E1] ml-5 mb-1 text-left w-full">
        선물 투표하기
      </h2>

      {/* 에러 */}
      {err && (
        <div className="w-full mb-2 text-sm text-red-600 px-2">{err}</div>
      )}

      {/* 리스트 / 결과 */}
      <div className="flex-1 w-full h-[445px] scrollbar-hide mb-4 mt-1">
        {hasVoted ? (
          <VoteWishResult results={results ?? []} />
        ) : (
          <VoteWishList
            items={items}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            loading={loading}
          />
        )}
      </div>

      {/* 버튼 */}
      <button
        className={`w-full h-[50px] text-[20px] font-semibold rounded-[12px] ${
          hasVoted || loading || selectedId == null
            ? "bg-[#C7D5FF] text-white cursor-not-allowed"
            : "bg-[#6282E1] text-white"
        }`}
        onClick={handleVote}
        disabled={hasVoted || loading || selectedId == null}
      >
        {loading ? "투표 중..." : hasVoted ? "투표 완료" : "투표하기"}
      </button>
    </div>
  );
};

export default VoteWishContainer;

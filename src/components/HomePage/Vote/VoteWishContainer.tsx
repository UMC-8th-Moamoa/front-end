import { useState } from "react";
import VoteWishList from "./VoteWishList";
import VoteWishResult from "./VoteWishResult";

const VoteWishContainer = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (selectedId === null) return;
    setHasVoted(true);
  };

  return (
    <div className="w-full max-w-[350px] mx-auto flex flex-col items-center pt-[10px]">
      {/* 타이틀 */}
      <h2 className="text-[18px] font-semibold text-[#6282E1]  ml-5 mb-1 text-left w-full">
        선물 투표하기
      </h2>

      {/* 리스트 */}
      <div className="flex-1 w-full h-[445px] scrollbar-hide mb-4 mt-1">
        {hasVoted ? (
          <VoteWishResult />
        ) : (
          <VoteWishList selectedId={selectedId} setSelectedId={setSelectedId} />
        )}
      </div>

      {/* 버튼 */}
      <button
        className={`w-full h-[50px] text-[20px] font-semibold rounded-[12px] ${
          hasVoted ? "text-white bg-[#C7D5FF]" : "bg-[#6282E1] text-white"
        }`}
        onClick={handleVote}
        disabled={hasVoted}
      >
        {hasVoted ? "다시 투표" : "투표하기"}
      </button>
    </div>
  );
};

export default VoteWishContainer;

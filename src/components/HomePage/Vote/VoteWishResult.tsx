import { type VoteResultsItem } from "../../../services/wishlist/vote";

interface VoteWishResultProps {
  results: VoteResultsItem[];
}

const VoteWishResult = ({ results }: VoteWishResultProps) => {
  const maxVotes = Math.max(0, ...results.map((r) => r.voteCount || 0));

  return (
    <div className="w-[350px] h-[580px] overflow-y-auto scrollbar-hide flex flex-col gap-2">
      {results.map((item) => {
        const percentage =
          maxVotes > 0 ? (item.voteCount ?? 0) / maxVotes : 0;

        return (
          <div key={item.itemId} className="flex flex-col gap-1 ml-[5px]">
            {/* 상품 이름 네모 */}
            <div className="w-full flex items-center gap-2">
              <div className="w-[98px] min-w-[98px] h-[58px] flex items-center justify-center text-[12px] text-center text-black border border-gray-300 rounded-xl px-2">
                {item.name.length > 10 ? item.name.slice(0, 10) + "..." : item.name}
              </div>

              {/* 바 + 숫자 */}
              <div className="flex-1 flex items-center gap-2">
                <div
                  className="h-[15px] bg-[#C7D5FF] rounded-[2px]"
                  style={{ width: `${Math.round(193 * percentage)}px` }}
                />
                <span className="text-[14px] text-[#C7D5FF] font-semibold">
                  {item.voteCount}명
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VoteWishResult;

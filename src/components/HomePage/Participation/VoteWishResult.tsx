import { recipientDummy } from "./RecipientDummy";

const VoteWishResult = () => {
  const maxVotes = Math.max(...recipientDummy.wishList.map((item) => item.voteCount));

  return (
    <div className="w-[350px] h-[440px] overflow-y-auto scrollbar-hide flex flex-col gap-2">
      {recipientDummy.wishList.map((item, index) => {
        const percentage = item.voteCount / maxVotes;

        return (
          <div key={index} className="flex flex-col gap-1 ml-[5px]">
            {/* 상품 이름 네모 */}
            <div className="w-full flex items-center gap-2">
              <div className="w-[98px] min-w-[98px] h-[58px] flex items-center justify-center text-[12px] text-center text-black border border-gray-300 rounded-xl">
                {item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}
              </div>

              {/* 바 + 숫자 */}
              <div className="flex-1 flex items-center gap-2">
                <div
                  className="h-[15px] bg-[#D9D9D9] rounded-[2px]"
                  style={{ width: `${193 * percentage}px` }}
                />
                <span className="text-[14px] text-[#B6B6B6] font-semibold">
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

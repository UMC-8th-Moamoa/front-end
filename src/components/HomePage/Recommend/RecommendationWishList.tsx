import MemberWishItem from "../Participation/MemberWishItem";
import { recommendationwishDummy } from "./RecommendationWishDummy";
import { useNavigate } from "react-router-dom";

const RecommendationWishList = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full mt-[32px] flex flex-col items-center">
      {/* 타이틀 영역 */}
      <div className="w-full max-w-[350px] px-2 flex justify-between items-center mb-[14px]">
        <h2 className="text-[18px] ml-2 font-semibold text-black">
          친구들의 추천 위시리스트
        </h2>
        <button
          className="text-[12px] text-gray-400"
          onClick={() => navigate("/recommend-wish-list")} 
        >
          생일 선물 추천하기 &gt;
        </button>
      </div>

      {/* 아이템 리스트 */}
      <div className="w-full max-w-[350px] flex overflow-x-auto scrollbar-hide px-2">
        {recommendationwishDummy.wishList.map((item, idx) => (
          <MemberWishItem key={idx} imageUrl={item.imageUrl} title={item.title} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationWishList;

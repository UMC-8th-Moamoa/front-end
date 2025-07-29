import BackButton from "../../components/common/BackButton";
import BottomNavigation from "../../components/common/BottomNavigation";
import { recipientDummy } from "../../components/HomePage/Participation/RecipientDummy";
import RecommendationWishList from "../../components/HomePage/Recommend/RecommendationWishList";
import VoteWishContainer from "../../components/HomePage/Vote/VoteWishContainer";

const VoteWishPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* 상단 헤더 */}
      <div className="w-full px-4 pt-[9px] flex items-center justify-between max-w-[430px] mx-auto">
        <BackButton />
        <h1 className="text-[18px] font-bold text-black text-center flex-1">
          {recipientDummy.name}님의 위시리스트
        </h1>
        <div className="w-[40px] h-[40px]" />
      </div>

      {/* 투표 위시 리스트 */}
      <div className="w-full px-4 max-w-[430px] mt-4">
        <VoteWishContainer />
      </div>

      {/* 추천 위시리스트 */}
      <div className="w-full px-4 max-w-[430px] mt-6 mb-[100px]">
        <RecommendationWishList />
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default VoteWishPage;

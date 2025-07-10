import BackButton from "../../components/common/BackButton";
import BottomNavigation from "../../components/common/BottomNavigation";
import { recipientDummy } from "../../components/HomePage/Participation/RecipientDummy";
import RecommendationWishList from "../../components/HomePage/Recommend/RecommendationWishList";
import VoteWishContainer from "../../components/HomePage/Vote/VoteWishContainer";


const VoteWishPage = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative">
      {/* 상단 헤더 */}
      <div className="w-full px-4 pt-[9px] flex items-center justify-between max-w-[430px] mx-auto">
        <BackButton />
        <h1 className="text-[18px] font-bold text-black text-center flex-1">
          {recipientDummy.name}님의 위시리스트
        </h1>
        <div className="w-[40px] h-[40px]" />
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 max-w-[430px] mx-auto"
        style={{ height: "calc(100vh - 260px)" }} // 헤더 60px + 추천 100px + 바텀 100px 고려
      >
        <VoteWishContainer />
      </div>

      {/* 고정 추천 위시리스트 */}
      <div className="w-full max-w-[430px] mx-auto px-4 absolute bottom-[58px] z-10">
        <RecommendationWishList />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default VoteWishPage;

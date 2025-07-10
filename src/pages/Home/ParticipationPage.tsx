import BackButton from "../../components/common/BackButton";
import BottomNavigation from "../../components/common/BottomNavigation";
import MemberWishList from "../../components/HomePage/Participation/MemberWishList";
import { participantDummy } from "../../components/HomePage/Participation/ParticipantDummy";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import ParticipationActionBox from "../../components/HomePage/Participation/ParticipationActionBox";
import RecipientBanner from "../../components/HomePage/Participation/RecipientBanner";

const ParticipationPage = () => {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col relative">
        {/* 상단 Back 버튼 + 참여인원 텍스트 */}
        <div className="flex items-center space-x-[8px] px-4 pt-5 mb-5">
          <BackButton />
          <p className="text-[17px] font-semibold text-black">
            참여인원 {participantDummy.length}명
          </p>
        </div>

        {/* 프로필 리스트 */}
        <div className="px-4">
          <ParticipantList />
        </div>

        {/* 구분선 */}
        <div className="w-[350px] h-px bg-[#D3D3D3] mx-auto mt-1 mb-8" />

        {/* 받는 사람 정보 */}
        <div className="px-4">
          <RecipientBanner />
        </div>

        {/* 위시리스트 */}
        <div className="px-4">
          <MemberWishList isMyPage={false} />
        </div>

        {/* 마음보태러가기 버튼 */}
        <div className="fixed bottom-[72px] left-1/2 transform -translate-x-1/2 w-full max-w-[393px] px-4 z-50">
          <ParticipationActionBox
            isMyPage={false}
            participationStatus="pending"
            onClick={() => console.log("버튼 클릭")}
          />
        </div>

        {/* 하단 네비게이션 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white w-full max-w-[393px]">
          <BottomNavigation />
        </footer>
      </div>
    </main>
  );
};

export default ParticipationPage;

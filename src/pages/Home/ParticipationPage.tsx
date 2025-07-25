import { useState } from "react";
import BackButton from "../../components/common/BackButton";
import MemberWishList from "../../components/HomePage/Participation/MemberWishList";
import { participantDummy } from "../../components/HomePage/Participation/ParticipantDummy";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import ParticipationActionBox from "../../components/HomePage/Participation/ParticipationActionBox";
import RecipientBanner from "../../components/HomePage/Participation/RecipientBanner";
import ShareModal from "../../components/HomePage/Participation/ShareModal";
import ClipboardToast from "../../components/HomePage/Participation/ClipBoardToast";

const ParticipationPage = () => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col relative">
        {copied && <ClipboardToast message="클립보드에 복사되었습니다" />}

        <div className="flex items-center space-x-[8px] px-4 pt-5 mb-5">
          <BackButton />
          <p className="text-[18px] font-bold text-black">
            참여인원 {participantDummy.length}명
          </p>
        </div>

        <div className="px-4">
          <ParticipantList />
        </div>

        <div className="w-[350px] h-px bg-[#D3D3D3] mx-auto mt-1 mb-5" />

        <div className="px-4">
          <RecipientBanner />
        </div>

        <div className="px-4">
          <MemberWishList isMyPage={false} />
        </div>

        <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2 w-full max-w-[393px] px-4 z-50">
          <ParticipationActionBox
            isMyPage={false}
            participationStatus="none"
            onClick={() => {}}
            onShareClick={() => setIsModalOpen(true)} // 버튼 클릭 시 모달 열기
          />
        </div>

        {/* ✅ 페이지 최하단에서 모달 렌더링 */}
        <ShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCopy={handleCopy}
        />
      </div>
    </main>
  );
};

export default ParticipationPage;

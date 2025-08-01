import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";

const DonationSelectPage = () => {
  const navigate = useNavigate();

  const handleGoToGoodneighbors = () => {
    navigate("/donation-complete-goodneighbors");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 중앙 정렬 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] font-normal text-black mb-2 ml-1">
            좋은 곳에 <span className="font-bold text-[#6282E1]">기부</span>해요!
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 leading-relaxed ml-1 mt-2">
            골드님의 따뜻한 손길이 누군가에게 큰<br />
            위로가 됩니다
          </p>

          {/* 기부처 버튼 */}
          <div className="w-full flex flex-col gap-3">
            <button className="w-full h-[50px] bg-white border border-[#6282E1] text-[#6282E1] rounded-xl text-[20px] font-semibold mt-8"
                    onClick={() => navigate("/receive-balance")}>
              한국 장애인 재단
            </button>
            <button
              className="w-full h-[50px] bg-white border border-[#6282E1] text-[#6282E1] rounded-xl text-[20px] font-semibold"
              onClick={handleGoToGoodneighbors}
            >
              굿네이버스
            </button>
            <button className="w-full h-[50px] bg-white border border-[#6282E1] text-[#6282E1] rounded-xl text-[20px] font-semibold"
                    onClick={() => navigate("/gift-certification")}>
              세이브 더 칠드런
            </button>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default DonationSelectPage;

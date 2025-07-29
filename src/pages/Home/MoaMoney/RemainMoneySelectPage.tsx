import { useNavigate} from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";

const RemainMoneySelectPage = () => {
  const navigate = useNavigate();


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 중앙 정렬 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] font-bold text-black mb-2 ml-1">
            10,000원
            <span className="font-normal">이 남았어요</span>
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 leading-relaxed ml-1 mt-2">
            어떻게 하면 좋을지 채원님의 선택에<br />맡길게요
          </p>

          {/* 선택 버튼들 */}
          <div className="w-full flex flex-col gap-3">
            <button className="w-full h-[50px] bg-gray-200 rounded-xl text-[20px] font-semibold mt-8"
                    onClick={() => navigate("/donation-select")}>
              기부하기
            </button>

            {/* 몽코인 버튼 + 추천 뱃지 */}
            <div className="relative w-full">
              <button className="w-full h-[50px] bg-gray-200 rounded-xl text-[20px] font-semibold"
                    onClick={() => navigate("/convert-to-mong")}>
                몽코인으로 전환
              </button>
              <span
                className="absolute top-1/2 right-[12px] transform -translate-y-1/2 
                text-[12px] text-gray-600 border border-[#8F8F8F] 
                rounded-[8px] px-[12px] py-[2px] bg-white"
              >
                추천!
              </span>
            </div>

            <button className="w-full h-[50px] bg-gray-200 rounded-xl text-[20px] font-semibold"
                    onClick={() => navigate("/return-to-friend")}>
              친구에게 돌려주기
            </button>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default RemainMoneySelectPage;

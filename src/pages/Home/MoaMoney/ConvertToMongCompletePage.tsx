import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";
import Button from "../../../components/common/Button";

const ConvertToMongCompletePage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] text-black font-normal mb-2 ml-1 leading-snug">
            <span className="font-bold">26MC</span>로<br />
            전환되었습니다
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            상점에서 원하는 아이템으로 교환해 보세요
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-black text-white text-[20px] font-medium mt-16 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default ConvertToMongCompletePage;

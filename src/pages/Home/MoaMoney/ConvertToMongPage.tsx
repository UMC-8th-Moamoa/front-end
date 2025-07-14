import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";
import Button from "../../../components/common/Button";

const ConvertToMongPage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/convert-to-mong-complete");
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
            <span className="font-bold">몽코인</span>으로 남은<br />
            마음을 바꾸세요!
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            전환되는 몽코인은 100원 단위까지 전환되<br />며 나머지 금액은 반올림 되어 적용됩니다
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-black text-white text-[20px] font-medium mt-16 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            전환하기
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default ConvertToMongPage;

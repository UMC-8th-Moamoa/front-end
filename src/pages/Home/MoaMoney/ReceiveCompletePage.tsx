import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";
import Button from "../../../components/common/Button";
import { useNavigate, useLocation } from "react-router-dom";

const ReceiveCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;


  const handleConfirm = () => {
    navigate("/remain-money-select", {
      state: { amount }, // 남은 금액 전달
    });
  };
  

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 */}
      <main className="w-full flex-grow flex flex-col justify-center items-start px-6 text-left">
        <h1 className="text-[48px] font-semibold text-black mb-2 ml-1">70,000원</h1>
        <p className="text-[32px] text-black mb-1 ml-1">친구들의 마음을 받았어요!</p>
        <p className="text-[14px] text-gray-400 mb-30 ml-2">
          송금 과정에 문제가 있다면 고객센터에 문의해 주세요
        </p>

        <Button
          size="medium"
          width="large"
          className="bg-black text-white text-[16px] font-medium w-[350px] h-[50px]"
          onClick={handleConfirm}
        >
          확인
        </Button>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default ReceiveCompletePage;

import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";
import Button from "../../../components/common/Button";

const ReturnToFriendCompletePage = () => {
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
            <span className="font-bold">친구들에게</span><br />
            잔금을 돌려주었습니다
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            추후 친구들이 돌려받지 않은 잔금은 친구<br />들에게 몽코인으로 전환되어 지급됩니다
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

export default ReturnToFriendCompletePage;

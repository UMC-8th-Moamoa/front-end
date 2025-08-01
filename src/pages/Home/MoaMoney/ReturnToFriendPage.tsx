import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import BottomNavigation from "../../../components/common/BottomNavigation";


const ReturnToFriendPage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("return-to-friend-complete");
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
            남은 잔금을<br />
            <span className="font-bold text-[#6282E1]">친구들</span>에게 돌려주세요!
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            친구들이 보낸 금액에 따라 잔금이 차등<br />분배됩니다
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-[#6282E1] text-white text-[20px] font-medium mt-16 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            돌려주기
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default ReturnToFriendPage;

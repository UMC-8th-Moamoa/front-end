import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import BottomNavigation from "../../../components/common/BottomNavigation";
import Button from "../../../components/common/Button";

const ReceiveBalancePage = () => {
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
            <span className="font-bold">채원님</span>의 모아에서<br />
            잔액이 돌아왔어요!
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 mt-4 ml-1">
            구글폼에 계좌 정보를 입력해 잔금을 돌려<br />받으세요!
          </p>

          <Button
            size="medium"
            width="large"
            className="bg-black text-white text-[20px] font-medium mt-16 w-[350px] h-[50px]"
            onClick={handleConfirm}
          >
            구글폼으로 가기
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default ReceiveBalancePage;

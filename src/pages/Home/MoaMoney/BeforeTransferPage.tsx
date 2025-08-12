// BeforeTransferPage.tsx
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";

const BeforeTransferPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount || 0;
  const formattedAmount = amount.toLocaleString();

  const handleClick = () => {

    // 홈페이지로 이동하면서 모달 보여주기 플래그 전달
    navigate("/", { state: { showTransferPendingModal: true } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 */}
      <main className="w-full flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-[393px] px-6 flex flex-col items-center gap-5">
          <h1 className="text-[48px] font-semibold text-left w-full">
            {formattedAmount}원
          </h1>
          <p className="text-[20px] font-normal w-full text-left -mt-5">
            을 송금해 드릴 예정이에요
          </p>

          <p className="text-[20px] mt-4 w-full text-left">
            계좌 송금을 위해 구글폼을 작성해 주세요
          </p>
          <p className="text-[14px] text-[#6C6C6C] w-full text-left -mt-3 mb-8">
            입금하는데 시간이 걸릴 수 있습니다
          </p>

          {/* 버튼 */}
          <Button
            size="medium"
            width="large"
            onClick={handleClick}
            className="h-[50px] w-[350px] mt-10 text-[20px]"
          >
            구글폼으로 가기
          </Button>
        </div>
      </main>

    </div>
  );
};

export default BeforeTransferPage;

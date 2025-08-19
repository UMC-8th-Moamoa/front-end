// BeforeTransferPage.tsx
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";

interface BeforeTransferPageProps {
  amount: number; // 전달받은 금액 (원 단위)
}

const BeforeTransferPage = ({ amount }: BeforeTransferPageProps) => {
  const formattedAmount = amount.toLocaleString();

  const handleClick = () => {
    window.open("https://forms.gle/your-google-form-link", "_blank");
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
          <h1 className="text-[32px] font-bold text-left w-full">
            {formattedAmount}원
          </h1>
          <p className="text-[20px] w-full text-left -mt-2">
            을 송금해 드릴 예정이에요
          </p>

          <p className="text-[18px] mt-6 w-full text-left font-medium">
            계좌 송금을 위해 구글폼을 작성해 주세요
          </p>
          <p className="text-[14px] text-gray-400 w-full text-left">
            입금하는데 시간이 걸릴 수 있습니다
          </p>

          {/* 버튼 */}
          <Button
            size="medium"
            width="large"
            onClick={handleClick}
            className="h-[50px] w-[350px] mt-10"
          >
            구글폼으로 작성하러 가기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BeforeTransferPage;

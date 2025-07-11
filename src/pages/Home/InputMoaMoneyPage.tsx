import { useState } from "react";
import BackButton from "../../components/common/BackButton";
import InputBox from "../../components/common/InputBox";
import Button from "../../components/common/Button";
import BottomNavigation from "../../components/common/BottomNavigation";

const InputMoaMoneyPage = () => {
  const [amount, setAmount] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumber = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 필터링
    setAmount(onlyNumber);
  };

  const formattedAmount = amount
    ? parseInt(amount, 10).toLocaleString()
    : "";

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 버튼 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 영역 */}
      <main className="w-full flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-[393px] px-6 flex flex-col items-center gap-5">
          {/* 텍스트 */}
          <div className="w-full text-left">
            <h1 className="text-[32px] font-bold leading-snug">
              채원님의 모아모아에
            </h1>
            <h1 className="text-[32px] leading-snug">
              보탤 금액을 입력해주세요
            </h1>
            <p className="text-[20px] text-gray-500 mt-7">
              20대는 평균 30,000원의 금액을 보탰어요
            </p>
          </div>

          {/* 입력창 */}
          <InputBox
            type="text"
            inputMode="numeric"
            placeholder="보탤 금액을 입력해 주세요"
            value={formattedAmount}
            onChange={handleChange}
            hasBorder={false}
            className={`bg-gray-100 h-[50px] mt-15 px-5 w-[350px]
              ${amount ? "text-[24px] font-bold text-black" : "text-[16px]"}`}
          />

          {/* 확인 버튼 */}
          <Button
            size="medium"
            width="large"
            onClick={() => console.log("입력된 금액:", amount)}
            className="h-[50px] w-[350px]"
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

export default InputMoaMoneyPage;

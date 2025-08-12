import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 추가
import BackButton from "../../../components/common/BackButton";
import InputBox from "../../../components/common/InputBox";
import Button from "../../../components/common/Button";

const InputMoaMoneyPage = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate(); // 👈 추가

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
    setAmount(onlyNumber);
  };

  const formattedAmount = amount
    ? parseInt(amount, 10).toLocaleString()
    : "";

  const handleConfirm = () => {
    console.log("입력된 금액:", amount);
    navigate("/purchase/payment"); // 👈 라우팅 추가
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white pb-[84px]">
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      <main className="w-full flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-[393px] px-6 flex flex-col items-center gap-5">
          <div className="w-full text-left">
            <h1 className="text-[32px] font-bold text-[#6282E1] leading-snug">
              채원님<span className="font-normal text-black">의 모아모아에</span>
            </h1>
            <h1 className="text-[32px] leading-snug">
              보탤 금액을 입력해주세요
            </h1>
            <p className="text-[20px] text-gray-500 mt-7">
              20대는 평균 30,000원의 금액을 보탰어요
            </p>
          </div>

          <InputBox
            type="text"
            inputMode="numeric"
            placeholder="보탤 금액을 입력해 주세요"
            value={formattedAmount}
            onChange={handleChange}
            hasBorder={false}
            className={`bg-[#E7EDFF] h-[50px] mt-15 px-5 w-[350px]
              ${amount ? "text-[24px] font-bold text-black" : "text-[16px]"}`}
          />

          <Button
            size="medium"
            width="large"
            onClick={handleConfirm} // 👈 여기 연결
            className="h-[50px] w-[350px]"
          >
            확인
          </Button>
        </div>
      </main>


    </div>
  );
};

export default InputMoaMoneyPage;

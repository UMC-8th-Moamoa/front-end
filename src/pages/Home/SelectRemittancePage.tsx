import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";
import SelectRemittance from "../../components/HomePage/Participation/SelectRemittance";

type Choice = "remit" | "noRemit";

const SelectRemittancePage = () => {
  const [choice, setChoice] = useState<Choice>("remit");
  const isRemit = choice === "remit";
  const navigate = useNavigate(); // ✅ 추가

  const moaImageSrc = isRemit
    ? "/assets/MoaRemittance.svg"
    : "/assets/MoaNoRemittance.svg";

  const handleConfirm = () => {
    if (isRemit) {
      navigate("/input-moa-money");        // ✅ 송금하고 참여하기
    } else {
      navigate("/moaletter/write");        // ✅ 송금 없이 참여하기
    }
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col relative pb-32">
        {/* 상단 바 */}
        <div className="flex items-center w-full px-4 pt-4 pb-2">
          <BackButton />
          <h1 className="flex-1 text-center text-lg font-semibold text-[#1F1F1F] -ml-5">
            모아 참여하기
          </h1>
        </div>

        {/* 선택 카드 */}
        <div className="w-[350px] mt-7 flex gap-[10px] mx-auto">
          <SelectRemittance
            type="with-money"
            title="송금하고 참여하기"
            subtitle="생일 선물을 위한 돈을 보태요"
            isSelected={isRemit}
            onClick={() => setChoice("remit")}
          />
          <SelectRemittance
            type="without-money"
            title="송금 없이 참여하기"
            subtitle="편지만 작성해 마음을 전해요"
            isSelected={!isRemit}
            onClick={() => setChoice("noRemit")}
          />
        </div>

        {/* 모아 캐릭터 이미지 */}
        <div className="w-full flex justify-center">
          <img
            src={moaImageSrc}
            alt="모아 캐릭터"
            className="w-[350px] max-w-[90%] select-none"
            draggable={false}
          />
        </div>

        {/* 하단 고정 영역: 마감 시간 + 버튼 */}
        <div className="absolute bottom-10 w-full px-4 flex flex-col items-stretch gap-3">
          <div className="w-full text-lg text-black text-left">
            마감 시간 00:00:00
          </div>
          <Button
            variant="primary"
            width="full"
            size="md"
            onClick={handleConfirm}   // ✅ 라우팅
          >
            확인
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SelectRemittancePage;

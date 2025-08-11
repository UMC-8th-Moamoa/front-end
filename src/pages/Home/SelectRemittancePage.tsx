import { useState } from "react";
import Button from "../../components/common/Button"; // 경로 맞게 수정
import SelectRemittance from "../../components/HomePage/Participation/SelectRemittance";

type Choice = "remit" | "noRemit";

const SelectRemittancePage = () => {
  const [choice, setChoice] = useState<Choice>("remit");

  const isRemit = choice === "remit";

  // 모아 캐릭터 이미지는 public/assets 기준 경로 사용
  const moaImageSrc = isRemit
    ? "/assets/MoaRemittance.svg"
    : "/assets/MoaNoRemittance.svg";

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col items-center">
        {/* 상단 여백 / 타이틀 영역은 프로젝트 상단바에 맞춰 조정 */}
        <div className="w-full px-5 pt-5" />

        {/* 선택 카드 2개 (가로 350, gap 10) */}
        <div className="w-[350px] mt-2 flex gap-[10px]">
          <SelectRemittance
            title="송금하고 참여하기"
            subtitle="생일 선물을 위한 돈을 보태요"
            iconSrc="/assets/PiggyBank.svg"     // 아이콘 경로 필요 시 교체
            isSelected={isRemit}
            onClick={() => setChoice("remit")}
          />
          <SelectRemittance
            title="송금 없이 참여하기"
            subtitle="편지만 작성해 마음을 전해요"
            iconSrc="/assets/PaperPlane.svg"    // 아이콘 경로 필요 시 교체
            isSelected={!isRemit}
            onClick={() => setChoice("noRemit")}
          />
        </div>

        {/* 모아 캐릭터 일러스트 */}
        <div className="w-full flex justify-center">
          <img
            src={moaImageSrc}
            alt="모아 캐릭터"
            className="w-[320px] max-w-[90%] mt-6 select-none"
            draggable={false}
          />
        </div>

        {/* 마감 시간 */}
        <div className="w-[350px] mt-8 mb-3 text-sm text-black">
          마감 시간 00:00:00
        </div>

        {/* 확인 버튼 (공용 Button.tsx 사용) */}
        <Button
          variant="primary"
          width="full"
          size="md"
          onClick={() => {
            // TODO: 라우팅 혹은 다음 스텝 로직
            // 예: navigate("/next")
            console.log("선택값:", choice);
          }}
          className="mb-6"
        >
          확인
        </Button>
      </div>
    </main>
  );
};

export default SelectRemittancePage;

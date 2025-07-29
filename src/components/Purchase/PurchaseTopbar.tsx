import BackButton from "../common/BackButton";

type Props = {
  userMC: number;
};

const PurchaseTopBar = ({ userMC }: Props) => {
  return (
    <div className="w-[393px] h-14 flex items-center justify-between px-1 relative">
      {/* 좌측 뒤로가기 버튼 */}
      <BackButton />

      {/* 중앙 제목 */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-[#1F1F1F]">
        몽코인 충전소
      </h1>

      {/* 우측 MC 뱃지 */}
      <div className="bg-[#E7EDFF] text-[#6282E1] text-sm font-semibold px-3 py-1 rounded-full">
        {userMC}MC
      </div>
    </div>
  );
};

export default PurchaseTopBar;
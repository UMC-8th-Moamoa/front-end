type Props = {
  userMC: number;
};

const ShoppingTopBar = ({ userMC }: Props) => {
  return (
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4">
      {/* 중앙 로고 */}
      <img
        src="/assets/MoamoaLogo.svg"
        alt="MOA MOA"
        className="h-5 absolute left-1/2 transform -translate-x-1/2"
      />

      {/* 우측 MC 뱃지 */}
      <div className="absolute right-1 bg-[#E7EDFF] text-[#6282E1] text-sm font-semibold px-3 py-1 rounded-full">
        {userMC}MC
      </div>
    </div>
  );
};

export default ShoppingTopBar;
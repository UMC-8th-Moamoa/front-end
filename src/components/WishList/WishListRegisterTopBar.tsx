import BackButton from "../common/BackButton";

interface WishListRegisterTopBarProps {
  selectedTab: "auto" | "manual";
  onTabChange: (tab: "auto" | "manual") => void;
}

const WishListRegisterTopBar = ({
  selectedTab,
  onTabChange,
}: WishListRegisterTopBarProps) => {
  return (
    <div className="w-full max-w-[393px] bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <BackButton />
        <h1 className="text-[18px] font-semibold text-center flex-1 -ml-8">
          위시리스트 등록
        </h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-around border-b border-[#C7D5FF]">
        {[
          { label: "자동 입력", key: "auto" },
          { label: "수동 입력", key: "manual" },
        ].map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as "auto" | "manual")}
              className={`pb-2 w-full text-center text-[16px] ${
                isActive
                  ? "font-semibold text-[#6282E1] border-b-2 border-[#6282E1]"
                  : "font-normal text-[#C7D5FF] border-b border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WishListRegisterTopBar;

import BackButton from "../../common/BackButton";


interface RecommendationTopBarProps {
  selectedTab: "auto" | "manual";
  onTabChange: (tab: "auto" | "manual") => void;
}

const RecommendationTopBar = ({
  selectedTab,
  onTabChange,
}: RecommendationTopBarProps) => {
  return (
    <div className="w-full max-w-[393px] bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <BackButton />
        <h1 className="text-[18px] font-bold text-center flex-1 -ml-8">
          위시리스트 추천
        </h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-around border-b border-gray-200">
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
                  ? "font-bold text-black border-b-2 border-black"
                  : "font-normal text-gray-400 border-b border-transparent"
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

export default RecommendationTopBar;

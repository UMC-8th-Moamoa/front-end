import clsx from "clsx";

interface SelectRemittanceProps {
  type: "with-money" | "without-money"; // 송금참여 / 무송금참여
  title: string;
  subtitle: string;
  isSelected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const SelectRemittance = ({
  type,
  title,
  subtitle,
  isSelected,
  disabled = false,
  onClick,
  className = "",
}: SelectRemittanceProps) => {
  // 상태별 아이콘 맵핑
  const iconMap: Record<string, string> = {
    "with-money-on": "/assets/PiggyBankOn.svg",
    "with-money-off": "/assets/PiggyBankOff.svg",
    "without-money-on": "/assets/PaperKiteOn.svg",
    "without-money-off": "/assets/PaperKiteOff.svg",
  };

  const iconSrc =
    type === "with-money"
      ? isSelected
        ? iconMap["with-money-on"]
        : iconMap["with-money-off"]
      : isSelected
      ? iconMap["without-money-on"]
      : iconMap["without-money-off"];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "relative w-[170px] h-[122px] rounded-[12px] bg-white p-3 text-left",
        "flex flex-col justify-between border transition-all",
        isSelected
          ? "border-[#6282E1]"
          : "border-[#E5E7EB] hover:border-[#C7D5FF]",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
    >
      {/* 상단: 아이콘 + 라디오 */}
      <div className="flex items-center justify-between">
        <img
          src={iconSrc}
          alt=""
          className="w-[35px] h-[35px]" // ✅ 크기 35x35 고정
        />
        {/* 라디오 모양 */}
        <div
          className={clsx(
            "w-5 h-5 rounded-full border flex items-center justify-center",
            isSelected ? "border-[#6282E1]" : "border-[#E5E7EB]"
          )}
        >
          <div
            className={clsx(
              "rounded-full",
              isSelected ? "w-2.5 h-2.5 bg-[#6282E1]" : "w-2.5 h-2.5 bg-transparent"
            )}
          />
        </div>
      </div>

      {/* 텍스트 */}
      <div className="mt-2">
        <div className="text-[16px] font-normal text-[#111111] leading-snug">
          {title}
        </div>
        <div className="text-[12px] text-[#9CA3AF] leading-snug mt-1">
          {subtitle}
        </div>
      </div>
    </button>
  );
};

export default SelectRemittance;

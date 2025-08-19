// src/components/HomePage/Participation/SelectRemittance.tsx
import clsx from "clsx";
import PaperKiteOn from "../../../assets/PaperKiteOn.svg";
import PaperKiteOff from "../../../assets/PaperKiteOff.svg";
import PiggyBankOn from "../../../assets/PiggyBankOn.svg";
import PiggyBankOff from "../../../assets/PiggyBankOff.svg";

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
  const iconMap = {
    "with-money-on": PiggyBankOn,
    "with-money-off": PiggyBankOff,
    "without-money-on": PaperKiteOn,
    "without-money-off": PaperKiteOff,
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
          ? "border-[#6282E1] shadow-[0_0_0_3px_rgba(98,130,225,0.15)]"
          : "border-[#E5E7EB] hover:border-[#C7D5FF]",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
    >
      {/* 상단: 아이콘 + 라디오 */}
      <div className="flex items-center justify-between">
        <img src={iconSrc} alt="" className="w-[35px] h-[35px]" />
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

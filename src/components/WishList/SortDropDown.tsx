import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const SORT_OPTIONS = ["등록순", "높은 가격순", "낮은 가격순", "공개", "비공개"];

interface SortDropdownProps {
  selected: string;
  onChange: (value: string) => void;
}

const SortDropdown = ({ selected, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-[14px] text-[#6282E1]">
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-[#C7D5FF] rounded-md px-3 py-[6px] w-[128px] h-[32px] bg-white"
      >
        <span className="mr-2">{selected}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#6282E1]" />
        ) : (
          <ChevronDown size={20} className="text-[#6282E1]" />
        )}
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white rounded-md border border-[#C7D5FF] overflow-hidden">
          {SORT_OPTIONS.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={clsx(
                "px-3 py-2 cursor-pointer hover:bg-gray-100",
                option === selected && "text-primary"
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;

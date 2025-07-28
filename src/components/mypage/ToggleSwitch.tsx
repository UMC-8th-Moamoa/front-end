// components/mypage/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <div
      className={`flex items-center w-[51px] h-[31px] aspect-[51/31] rounded-full cursor-pointer transition-all duration-300 ${
        checked ? 'bg-[#6282E1] px-[2px] justify-end' : 'bg-[#E1E1E1] px-[2px] justify-start'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{ backgroundColor: '#FFFFFF' }}
        className="w-[27px] h-[27px] flex-shrink-0 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_3px_8px_0_rgba(0,0,0,0.15),0_3px_1px_0_rgba(0,0,0,0.06)]"
      ></div>
    </div>
  );
}

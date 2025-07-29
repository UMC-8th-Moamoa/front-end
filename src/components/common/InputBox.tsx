import React from "react";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "search";
  className?: string;
  hasBorder?: boolean;
  error?: string; //오류 메시지 추가
}

const InputBox = ({
  type = "text",
  className = "",
  hasBorder = true,
  error,
  ...props
}: InputBoxProps) => {
  return (
    <div className="relative w-[350px]">
      <input
        type={type}
        className={`w-full h-[50px] px-4 py-2 rounded-[12px] text-sm 
          text-[#1F1F1F] placeholder:text-[#97B1FF] bg-[#E7EDFF]
          ${hasBorder ? "border border-[#97B1FF]" : "appearance-none outline-none border-none"} 
          ${className}`}
        {...props}
      />
      {error && (
        <p className="absolute top-full mt-1 text-xs text-[#E20938]">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputBox;


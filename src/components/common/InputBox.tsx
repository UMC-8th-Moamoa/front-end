import React from "react";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "search";
  className?: string;
  hasBorder?: boolean;
}

const InputBox = ({
  type = "text",
  className = "",
  hasBorder = true,
  ...props
}: InputBoxProps) => {
  return (
    <input
      type={type}
      className={`w-[350px] h-[50px] px-4 py-2 rounded-[12px] text-sm 
        text-[#1F1F1F] placeholder:text-[#97B1FF] bg-[#E7EDFF]
        ${hasBorder ? "border border-[#97B1FF]" : "appearance-none outline-none border-none"} 
        ${className}`}
      {...props}
    />
  );
};

export default InputBox;
import React from "react";

type Variant = "primary" | "secondary" | "kakao" | "gray" | "outline";
type Size = "small" | "medium" | "large";
type Width = "full" | "fit" | "fixed";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  width?: Width;
  className?: string;
}

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "medium",
  width = "full",
  className = "",
}: ButtonProps) => {
  const baseStyle = "rounded-xl font-semibold font-pretendard transition-colors duration-200 text-center";

  // 크기 스타일
  const sizeStyle = {
    small: "text-sm py-1.5 px-3",
    medium: "text-base py-2.5 px-4",
    large: "text-lg py-3 px-5",
  }[size];

  // 너비 스타일
   const widthStyle =
    width === "full"
      ? "w-full"
      : width === "fit"
      ? "w-fit"
      : {
          small: "w-[200px]",
          medium: "w-[300px]",
          large: "w-[350px]",
        }[size];


  // variant에 따라 버튼 스타일 설정
const variantMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: disabled
    ? "bg-[#D9D9D9] text-white"
    : "bg-black text-white hover:bg-gray-800",
  secondary: disabled
    ? "bg-gray-100 text-gray-400 border border-gray-300"
    : "bg-white text-gray-700 hover:bg-gray-100",
  kakao: disabled
    ? "bg-[#FEE500] text-gray-400"
    : "bg-[#FEE500] text-black hover:brightness-95",
  gray: disabled
    ? "bg-[#D9D9D9] text-black"
    : "bg-[#D9D9D9] text-black hover:brightness-85",
  outline: disabled
    ? "border-2 border-gray-300 text-gray-300"
    : "border-2 border-gray-400 text-gray-400 hover:bg-gray-100",
};

const variantStyle = variantMap[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
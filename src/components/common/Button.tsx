import React from "react";
import clsx from "clsx";


type Variant = "primary" | "secondary" | "kakao" | "login" | "text";
type FontSize = "xs" | "sm" | "md" | "lg" | "xl";
type PaddingSize = "xs" | "sm" | "md" | "lg" | "xl";
type Width = "full" | "fit" | "fixed";
type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: Variant;
  fontSize?: FontSize;
  size?: PaddingSize;
  fontWeight?: FontWeight;
  width?: Width;
  className?: string;
}

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  fontSize = "md",
  size = "md",
  width = "full",
  fontWeight = "semibold",
  className = "",
}: ButtonProps) => {

  const baseStyle = "rounded-lg transition-colors duration-200 text-center";


  const fontSizeMap: Record<FontSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const paddingSizeMap: Record<PaddingSize, string> = {
    xs: "py-1 px-2",
    sm: "py-1.5 px-3",
    md: "py-2.5 px-4",
    lg: "py-3 px-5",
    xl: "py-4 px-6",
  };

  const fixedWidths: Record<PaddingSize, string> = {
    xs: "w-[100px]",
    sm: "w-[160px]",
    md: "w-[200px]",
    lg: "w-[260px]",
    xl: "w-[320px]",
  };

  const widthStyle =
    width === "full"
      ? "w-full"
      : width === "fit"
      ? "w-fit"
      : fixedWidths[size];

  const fontWeightMap: Record<FontWeight, string> = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const fontWeightClass = fontWeightMap[fontWeight];

  const variantMap: Record<Variant, string> = {
    primary: disabled
      ? "bg-[#C7D5FF] text-white"
      : "bg-[#6282E1] text-white hover:bg-[#7090ED] active:bg-[#5A7DE3]",
    secondary:
      "bg-white text-[#6282E1] border border-[#6282E1] hover:bg-[#F1F4FF] active:border-2",
    kakao: disabled
      ? "bg-[#FEE500] text-gray-400"
      : "bg-[#FEE500] text-black hover:bg-[#F1F4FF] active:bg-[#F1F4FF]",
    login:
      "bg-white text-[#6282E1] hover:bg-[#F1F4FF] active:bg-white",
    text: disabled
      ? "text-gray-300"
      : "hover:text-gray-200 hover:font-medium transition-all duration-200",
  };

  const finalClassName = clsx(
    baseStyle,
    fontSizeMap[fontSize],
    paddingSizeMap[size],
    fontWeightClass,
    variantMap[variant],
    widthStyle,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  );
};

export default Button;
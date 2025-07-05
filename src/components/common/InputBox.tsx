import React from "react";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "search";
  className?: string;
}

const InputBox = ({ type = "text", className = "", ...props }: InputBoxProps) => {
  return (
    <input
      type={type}
      className={`w-full px-4 py-2 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default InputBox;

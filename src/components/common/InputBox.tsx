import React from "react";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "search";
  className?: string;
  error?: string; 
}

const InputBox = ({ type = "text", className = "", error, ...props }: InputBoxProps) => {
  return (
    <div className="w-full max-w-[350px] mx-auto">
      <input
        type={type}
        className={`
          w-full px-4 py-3
          rounded-xl
          bg-[#EAEAEA]
          text-black text-sm
          focus:outline-none
          ${error ? 'border border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 pl-1">
          • {error}
        </p>
      )}
    </div>
  );
};

export default InputBox;
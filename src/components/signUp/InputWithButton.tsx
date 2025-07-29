import React from "react";
import Button from "../common/Button";
import InputBox from "../common/InputBox";

interface InputWithButtonProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickButton: () => void;
  placeholder?: string;
  buttonText: string;
  disabled?: boolean;
  inputType?: string;
  inputName?: string;
  className?: string;
  error?: string; 
}

const InputWithButton = ({
  value,
  onChange,
  onClickButton,
  placeholder = "",
  buttonText,
  disabled = false,
  inputType = "text",
  inputName,
  className = "",
  error, 
}: InputWithButtonProps) => {
  return (
    <div className={`w-full max-w-[350px] mx-auto mb-3 whitespace-nowrap ${className}`}>
      <div className="flex items-center gap-2">
        <InputBox
          type={inputType}
          name={inputName}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex-1 bg-[#E7EDFF] ${error ? 'border border-red-500' : ''}`}
        />
        <Button
          onClick={onClickButton}
          variant="signup"
          size="md"
          width="fit"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 pl-1">• {error}</p>
      )}
    </div>
  );
};

export default InputWithButton;
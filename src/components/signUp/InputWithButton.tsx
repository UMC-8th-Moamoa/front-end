// src/components/signUp/InputWithButton.tsx
import React from "react";
import Button from "../common/Button";
import InputBox from "../common/InputBox";

// InputBox의 type과 동일한 리터럴 유니온으로 제한
type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

interface InputWithButtonProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickButton: () => void;
  placeholder?: string;
  buttonText: string;
  disabled?: boolean;
  inputType?: InputType;            // ← 변경
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
  inputType = "text",              // ← 기본값 그대로
  inputName,
  className = "",
  error,
}: InputWithButtonProps) => {
  return (
    <div className={`w-full max-w-[350px] mx-auto mb-3 whitespace-nowrap ${className}`}>
      <div className="flex items-center gap-2">
        <InputBox
          type={inputType}                      // ← 이제 타입 일치
          name={inputName}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          hasBorder={false}
          error={error}
          className={`flex-1 ${error ? 'border border-[#E20938]' : ''}`}
        />
        <Button
          onClick={onClickButton}
          variant="signup"
          size="md"
          width="fit"
          disabled={disabled}
          className="h-[50px]"
        >
          {buttonText}
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#E20938] pl-1">• {error}</p>
      )}
    </div>
  );
};

export default InputWithButton;

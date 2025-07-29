import React, { useState, useRef, useEffect } from "react";
import Button from "../common/Button";
import InputBox from "../common/InputBox";
import { FiChevronDown } from "react-icons/fi"; // 아이콘 사용

interface EmailInputProps {
  emailId: string;
  onChangeEmailId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emailDomain: string;
  onChangeEmailDomain: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClickVerify: () => void;
  disabled?: boolean;
}

const EmailInputWithSelect = ({
  emailId,
  onChangeEmailId,
  emailDomain,
  onChangeEmailDomain,
  onClickVerify,
  disabled = false,
}: EmailInputProps) => {
  const domains = ["@gmail.com", "@naver.com"];
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center mb-3 w-full max-w-[350px] mx-auto">
      {/* 이메일 아이디 입력 */}
      <InputBox
        type="text"
        placeholder="이메일"
        value={emailId}
        onChange={onChangeEmailId}
        className="basis-1/2 border-none rounded-l-xl rounded-r-none text-sm text-black"
      />

      {/* 도메인 드롭다운 */}
      <div className="relative basis-1/2" ref={dropdownRef}>
        {/* 선택된 도메인 + 아이콘 */}
        <button
          type="button"
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="w-full h-[50px] bg-white border border-[#97B1FF] rounded-r-xl px-4 py-3 text-sm text-black flex items-center justify-between"
        >
          <span>{emailDomain}</span>
          <FiChevronDown className="ml-2 text-[#97B1FF]" />
        </button>

        {/* 드롭다운 리스트 */}
        {openDropdown && (
          <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white border border-[#97B1FF] rounded-xl shadow-md overflow-hidden">
            {domains
              .filter((d) => d !== emailDomain)
              .map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    const event = {
                      target: { value: domain },
                    } as React.ChangeEvent<HTMLSelectElement>;
                    onChangeEmailDomain(event);
                    setOpenDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-[#EAF1FF]"
                >
                  {domain}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* 본인인증 버튼 */}
      <Button
        variant="signup"
        size="md"
        width="fit"
        className="px-4 py-2 ml-2 whitespace-nowrap h-[50px]"
        onClick={onClickVerify}
        disabled={disabled}
      >
        본인인증
      </Button>
    </div>
  );
};

export default EmailInputWithSelect;
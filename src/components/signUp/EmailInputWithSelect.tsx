import React from "react";
import Button from "../common/Button";
import InputBox from "../common/InputBox";

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
  return (
     <div className="flex items-center gap-2 mb-3 w-full max-w-[350px] mx-auto">
      {/* 입력 + 도메인 선택 */}
      <div className="flex items-center w-full overflow-hidden rounded-xl">
        <InputBox
            type="text"
            placeholder="이메일"
            value={emailId}
            onChange={onChangeEmailId}
            className="basis-1/2 border-none rounded-l-xl rounded-r-none text-sm text-black focus:outline-none"
        />
        {/* 도메인 선택 */}
        <select
            value={emailDomain}
            onChange={onChangeEmailDomain}
            className="basis-1/2 bg-white px-4 py-3 text-sm text-black border border-[#97B1FF] rounded-r-xl rounded-l-none focus:outline-none"
        >
            <option value="@gmail.com">@gmail.com</option>
            <option value="@naver.com">@naver.com</option>
        </select>
        </div>


      {/* 인증 버튼 */}
      <Button
        variant="primary"
        size="md"
        width="fit"
        className="px-4 py-2 whitespace-nowrap"
        onClick={onClickVerify}
        disabled={disabled}
      >
        본인인증
      </Button>
    </div>
  );
};

export default EmailInputWithSelect;
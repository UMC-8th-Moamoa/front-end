

interface TermsState {
  service: boolean;
  privacy: boolean;
  marketing: boolean;
}

interface TermsAgreementProps {
  value: TermsState;
  onChange: (next: TermsState) => void;
}

const TermsAgreement = ({ value, onChange }: TermsAgreementProps) => {
  const allChecked = value.service && value.privacy && value.marketing;

  const handleAllChange = () => {
    const nextValue = {
      service: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked,
    };
    onChange(nextValue);
  };

  const handleItemChange = (key: keyof TermsState) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <div className="w-full max-w-[350px] mx-auto border border-gray-300 rounded-xl p-4 mb-6 text-sm bg-white">
      {/* 전체 동의하기 */}
      <label className="flex items-start mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleAllChange}
          className="mt-1 mr-3 accent-black w-4 h-4"
        />
        <div>
          <p className="font-semibold text-base">전체 동의하기</p>
          <p className="text-gray-500 text-sm mt-1">
            전체동의는 선택목적에 대한 동의를 포함하고 있으며,<br />
            선택 목적에 대한 동의를 거부해도 서비스 이용이 가능합니다.
          </p>
        </div>
      </label>

      <hr className="my-3 border-gray-300" />

      {/* 약관 항목 */}
      <div className="flex flex-col gap-3 text-gray-500">
        <label className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value.service}
              onChange={() => handleItemChange("service")}
              className="mr-2 accent-black w-4 h-4"
            />
            <span>[필수] 서비스 이용 약관 동의</span>
          </div>
          <span className="text-sm text-gray-400 underline">보기</span>
        </label>

        <label className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value.privacy}
              onChange={() => handleItemChange("privacy")}
              className="mr-2 accent-black w-4 h-4"
            />
            <span>[필수] 개인정보 수집 및 이용 동의</span>
          </div>
          <span className="text-sm text-gray-400 underline">보기</span>
        </label>

        <label className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value.marketing}
              onChange={() => handleItemChange("marketing")}
              className="mr-2 accent-black w-4 h-4"
            />
            <span>[선택] 홍보성 정보 수신 동의</span>
          </div>
          <span className="text-sm text-gray-400 underline">보기</span>
        </label>
      </div>
    </div>
  );
};

export default TermsAgreement;
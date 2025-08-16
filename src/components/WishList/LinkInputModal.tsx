import { useEffect, useState } from "react";
import InputBox from "../common/InputBox";
import { Modal } from "../common/Modal";

interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void; // ✅ 반드시 문자열 전달
  defaultValue?: string;            // ✅ 열릴 때 초기값(선택)
}

const LinkInputModal = ({ isOpen, onClose, onConfirm, defaultValue = "" }: LinkInputModalProps) => {
  const [value, setValue] = useState<string>(defaultValue);

  // 모달이 열릴 때마다 기본값 동기화
  useEffect(() => {
    if (isOpen) setValue(defaultValue ?? "");
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const url = value.trim();
    if (!url) return;
    onConfirm(url); // ✅ 문자열로 전달
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[320px] p-6 gap-4">
      <h2 className="text-[18px] font-semibold text-[#1F1F1F] text-center">
        링크를 붙여 넣어주세요
      </h2>

      <InputBox
        value={value}                                // ✅ 컨트롤드
        onChange={(e) => setValue(e.target.value)}   // ✅ 이벤트→문자열
        placeholder="링크를 넣어주세요"
        hasBorder={false}
        className="!w-[276px] ml-9"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <div className="flex w-full gap-2">
        <button
          className="flex-1 h-[40px] rounded-[10px] border border-[#6282E1] text-[#6282E1] font-medium"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="flex-1 h-[40px] rounded-[10px] bg-[#6282E1] text-white font-medium disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default LinkInputModal;

import InputBox from "../common/InputBox";
import { Modal } from "../common/Modal";


interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LinkInputModal = ({ isOpen, onClose, onConfirm }: LinkInputModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[320px] p-6 gap-4">
      <h2 className="text-[18px] font-semibold text-[#1F1F1F] text-center">링크를 붙여 넣어주세요</h2>
      <InputBox 
        placeholder="링크를 넣어주세요"
        hasBorder={false}
        className="!w-[276px]" 
      />
      <div className="flex w-full gap-2">
        <button
          className="flex-1 h-[40px] rounded-[10px] border border-[#6282E1] text-[#6282E1] font-medium"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="flex-1 h-[40px] rounded-[10px] bg-[#6282E1] text-white font-medium"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default LinkInputModal;

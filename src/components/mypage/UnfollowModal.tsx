import React from 'react';
import Modal from '../../components/common/Modal';

interface UnfollowConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UnfollowConfirmModal({ isOpen, onClose, onConfirm }: UnfollowConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-[16px] font-semibold font-pretendard text-black mb-[16px]">팔로우를 취소하시겠습니까?</div>
      <div className="flex justify-between w-full px-[24px]">
        <button
          onClick={onClose}
          className="w-[100px] h-[36px] border border-gray-300 rounded-[10px] text-[14px] text-black"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="w-[100px] h-[36px] bg-gray-600 text-white rounded-[10px] text-[14px]"
        >
          확인
        </button>
      </div>
    </Modal>
  );
}

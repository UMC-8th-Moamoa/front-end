import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-[350px] h-[130px] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

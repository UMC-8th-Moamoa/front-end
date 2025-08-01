
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // 추가
}

export const Modal = ({ isOpen, onClose, children, className = "" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[20px] flex flex-col px-6 py-6 min-w-[280px] max-w-[90%] items-center justify-center ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};


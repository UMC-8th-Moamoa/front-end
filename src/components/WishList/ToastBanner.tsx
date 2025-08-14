// src/components/WishList/ToastBanner.tsx
type Props = {
  show: boolean;
  message: string;
};

const ToastBanner = ({ show, message }: Props) => {
  if (!show) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="w-[350px] min-h-[44px] px-4 py-3 rounded-[12px] shadow-md bg-white text-center border border-[#C7D5FF]">
        <span className="text-[14px] text-[#1F1F1F]">{message}</span>
      </div>
    </div>
  );
};

export default ToastBanner;

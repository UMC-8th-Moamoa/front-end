import X_logo from "../../../assets/X_logo.svg";
import Kakaotalk_logo from "../../../assets/Kakaotalk_logo.svg";
import Instagram_logo from "../../../assets/Instagram_logo.svg";
import Discord_logo from "../../../assets/Discord_logo.svg";
import Gmail_logo from "../../../assets/Gmail_logo.svg";



interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

const icons = [
  { name: "Gmail", src: Gmail_logo },
  { name: "카카오톡", src: Kakaotalk_logo },
  { name: "Discord", src: Discord_logo },
  { name: "Instagram", src: Instagram_logo },
  { name: "X", src: X_logo },
];

const ShareModal = ({ isOpen, onClose, onCopy }: ShareModalProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onCopy();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-none"
            onClick={onClose}
          />

          <div
            className="fixed bottom-0 left-0 right-0 z-50 pt-4 px-6"
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: "40px",
              borderTopRightRadius: "40px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[74px] h-[6px] bg-[#B7B7B7] rounded-full mx-auto mb-6" />

            <div className="flex justify-around items-center mb-4 mt-5">
              {icons.map((icon) => (
                <div key={icon.name} className="flex flex-col items-center gap-2">
                  <img src={icon.src} alt={icon.name} width={54} height={54} />
                  <span className="text-[13px] text-[#1F1F1F] text-center leading-none">
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#E1E1E1] mt-5" />

            <div
              className="flex items-center gap-2 pl-2 py-4 cursor-pointer"
              onClick={handleCopyLink}
            >
              <img src="/assets/Copy.svg" alt="copy" width={54} height={54} />
              <span className="text-[18px] ml-3 text-[#6282E1]">링크 복사</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShareModal;

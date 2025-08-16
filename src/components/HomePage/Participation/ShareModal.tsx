import { useEffect, useState } from "react";
import X_logo from "../../../assets/X_logo.svg";
import Kakaotalk_logo from "../../../assets/Kakaotalk_logo.svg";
import Instagram_logo from "../../../assets/Instagram_logo.svg";
import Discord_logo from "../../../assets/Discord_logo.svg";
import Gmail_logo from "../../../assets/Gmail_logo.svg";
import { createShareUrl } from "../../../services/user/share";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  /** ✅ 복사할 공유 URL을 만들 이벤트 ID (내 이벤트/참여 화면 등에서 넘겨주세요) */
  eventId?: number;
  /** 필요하면 미리 생성된 URL을 직접 넘길 수도 있어요. */
  presetUrl?: string;
}

const icons = [
  { name: "Gmail", src: Gmail_logo },
  { name: "카카오톡", src: Kakaotalk_logo },
  { name: "Discord", src: Discord_logo },
  { name: "Instagram", src: Instagram_logo },
  { name: "X", src: X_logo },
];

const ShareModal = ({ isOpen, onClose, onCopy, eventId, presetUrl }: ShareModalProps) => {
  const [shareUrl, setShareUrl] = useState<string>("");

  // 모달 열릴 때 공유 URL 준비
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1) 부모가 준비해 준 URL 우선
        if (presetUrl) {
          if (!cancelled) setShareUrl(presetUrl);
          return;
        }

        // 2) eventId가 있으면 서버에서 생성
        if (eventId && isOpen) {
          const res = await createShareUrl(eventId);
          if (!cancelled) setShareUrl(res.shareUrl);
          return;
        }

        // 3) 둘 다 없으면 현재 주소를 fallback
        if (!cancelled) setShareUrl(window.location.href);
      } catch {
        if (!cancelled) setShareUrl(window.location.href);
      }
    }

    if (isOpen) load();
    return () => { cancelled = true; };
  }, [isOpen, eventId, presetUrl]);

  const handleCopyLink = async () => {
    const url = shareUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      onCopy();
    } finally {
      onClose();
    }
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

            {/* 준비된 URL 미리보기(선택) */}
            {shareUrl && (
              <div className="pb-4 px-2 text-xs text-gray-500 break-all">
                {shareUrl}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ShareModal;

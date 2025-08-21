// src/components/HomePage/Banner/ShareModal.tsx
import { useEffect, useState } from "react";
import { createShareUrl } from "../../../services/user/share";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  /** 복사할 공유 URL을 만들 이벤트 ID (선택) */
  eventId?: number;
  /** 미리 생성된 URL을 직접 넘길 수 있음 (우선 사용) */
  presetUrl?: string;
}

const ShareModal = ({ isOpen, onClose, onCopy, eventId, presetUrl }: ShareModalProps) => {
  const [shareUrl, setShareUrl] = useState<string>("");

  // 모달 열릴 때 공유 URL 준비
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (presetUrl) {
          if (!cancelled) setShareUrl(presetUrl);
          return;
        }
        if (eventId && isOpen) {
          const res = await createShareUrl(eventId);
          if (!cancelled) setShareUrl(res.shareUrl);
          return;
        }
        if (!cancelled) setShareUrl(window.location.href);
      } catch {
        if (!cancelled) setShareUrl(window.location.href);
      }
    }

    if (isOpen) load();
    return () => {
      cancelled = true;
    };
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/25"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 pt-4 px-6 bg-white"
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grabber */}
        <div className="w-[74px] h-[6px] bg-[#B7B7B7] rounded-full mx-auto mb-2" />

        {/* 링크 복사 한 줄만 */}
        <button
          type="button"
          className="w-full flex items-center gap-3 pl-2 py-4 cursor-pointer"
          onClick={handleCopyLink}
        >
          <img src="/assets/Copy.svg" alt="링크 복사" width={54} height={54} />
          <span className="text-[18px] text-[#6282E1]">링크 복사</span>
        </button>

        {/* (선택) 준비된 URL 미리보기 */}
        {shareUrl && (
          <div className="pb-4 px-2 text-xs text-gray-500 break-all">
            {shareUrl}
          </div>
        )}
      </div>
    </>
  );
};

export default ShareModal;

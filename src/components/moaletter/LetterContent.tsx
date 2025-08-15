// src/components/moaletter/LetterContent.tsx
import type { RefObject } from "react";
import { useEffect } from "react";

export interface LetterContentProps {
  letterText: string;
  onChange: (value: string) => void;
  activeTool: "none" | "keyboard" | "font" | "theme";
  textareaRef: RefObject<HTMLTextAreaElement | null>;

  // ✅ 추가된 props
  backgroundUrl?: string | null;   // 편지지 배경 이미지
  fontFamily?: string | null;      // 글꼴명
}

export default function LetterContent({
  letterText,
  onChange,
  activeTool,
  textareaRef,
  backgroundUrl,
  fontFamily,
}: LetterContentProps) {
  useEffect(() => {
    if (activeTool === "keyboard") textareaRef.current?.focus();
  }, [activeTool]);

  return (
    <div
      className="relative mt-[22px] w-[350px] h-[369px] mx-auto rounded-[20px] bg-[#F2F2F2] overflow-hidden"
      style={
        backgroundUrl
          ? { backgroundImage: `url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      <div className="relative w-full h-full rounded-[20px] bg-transparent">
        <textarea
          ref={textareaRef}
          className="
            w-full h-full pt-[18px] pl-[21px] pr-[16px] pb-[24px]
            rounded-[20px] bg-transparent text-[16px] font-normal leading-normal
            resize-none border-none focus:outline-none focus:ring-0
            placeholder:text-[#B7B7B7] placeholder:text-[16px]
          "
          style={{ fontFamily: fontFamily ?? "Pretendard, sans-serif" }}
          placeholder="생일 축하해!"
          value={letterText}
          onChange={(e) => onChange(e.target.value)}
          maxLength={1000}
        />
        <div className="absolute bottom-[10px] right-[12px] text-[12px] text-[#B7B7B7]">
          {letterText.length}/1000
        </div>
      </div>
    </div>
  );
}

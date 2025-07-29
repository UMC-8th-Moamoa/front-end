import type { RefObject } from "react";
import { useEffect } from "react";

interface LetterContentProps {
  letterText: string;
  onChange: (value: string) => void;
  activeTool: "none" | "keyboard" | "font" | "theme";
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export default function LetterContent({
  letterText,
  onChange,
  activeTool,
  textareaRef,
}: LetterContentProps) {
  useEffect(() => {
    if (activeTool === "keyboard") {
      textareaRef.current?.focus();
    }
  }, [activeTool]);

  return (
    <div className="relative mt-[22px] w-full max-w-[360px] mx-auto">
      {/* 입력창 + 카운트 텍스트 같이 감싸는 div */}
      <div className="relative w-full h-[369px] rounded-[20px] bg-[#F2F2F2]">
        <textarea
  ref={textareaRef}
  className="
    w-full h-full pt-[18px] pl-[21px] pr-[16px] pb-[10px]
    rounded-[20px]
    bg-transparent
    text-[16px] font-normal font-pretendard leading-normal
    resize-none
    border-none focus:outline-none focus:ring-0
    placeholder:text-[#B7B7B7] placeholder:text-[16px]
    placeholder:font-normal placeholder:font-pretendard
  "
  placeholder="생일 축하해!"
  value={letterText}
  onChange={(e) => onChange(e.target.value)}
  maxLength={1000}
/>

        {/* 입력창 내부 오른쪽 하단에 위치한 글자 수 표시 */}
        <div className="absolute bottom-[12px] right-[12px] text-[12px] text-[#B7B7B7] font-pretendard">
          {letterText.length}/1000
        </div>
      </div>
    </div>
  );
}

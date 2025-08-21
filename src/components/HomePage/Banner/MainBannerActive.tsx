// src/components/HomePage/Banner/MainBannerActive.tsx
import { useEffect, useMemo, useState } from "react";

type Props = {
  userName?: string;            // 우선 사용
  buttonText?: string;          // 기본: "모아모아 보러가기"
  onClick?: () => void;
  imageSrc?: string;            // 기본: "/assets/Moa.png"
  fallbackName?: string;        // 기본: "사용자"
};

function readNameFromStorage(): string | null {
  try {
    const directKeys = ["userName", "username", "name"];
    for (const k of directKeys) {
      const v = localStorage.getItem(k);
      if (v && v !== "null" && v !== "undefined") return v;
    }
    const blobKeys = ["profile", "user", "me"];
    for (const k of blobKeys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      const cand = obj?.name ?? obj?.userName ?? obj?.username;
      if (typeof cand === "string" && cand) return cand;
    }
  } catch {}
  return null;
}

const MainBannerActive = ({
  userName,
  buttonText = "모아모아 보러가기",
  onClick,
  imageSrc = "/assets/Moa.png",
  fallbackName = "사용자",
}: Props) => {
  const [storedName, setStoredName] = useState<string | null>(null);

  useEffect(() => {
    if (!userName) setStoredName(readNameFromStorage());
  }, [userName]);

  const displayName = useMemo(
    () => userName || storedName || fallbackName,
    [userName, storedName, fallbackName]
  );

  return (
    <div className="w-[393px] flex justify-center px-5 py-2">
      <div
        role="button"
        aria-label="메인 진행 배너"
        className="relative w-[350px] h-[155px] rounded-[20px] overflow-hidden cursor-pointer
                   bg-gradient-to-br from-[#6282E1] to-[#FEC3FF] shadow"
        onClick={onClick}
      >
        {/* 좌측 모아 캐릭터 (피그마 좌표 반영) */}
        <img
          src={imageSrc}
          alt="모아 캐릭터"
          className="pointer-events-none select-none absolute
                     left-[-50px] top-[0px] w-[238.55px] h-[238.55px] rotate-[30deg]"
        />

        {/* 타이틀 (20/Bold, 2줄) — 좌표: left 150, top 24 */}
        <h2
          className="absolute left-[155px] top-[20px] text-white text-[20px] leading-[1.25]"
          // leading-100% == 1
        >
          <span className="font-bold">{displayName}님</span>을 위한
          <br />
          모아가 진행 중이에요!
        </h2>

        {/* CTA (12/Medium) — 우하단 */}
        <div className="absolute right-[18px] bottom-[18px]">
          <span className="text-[13px] font- text-white pr-2">
            {buttonText} &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainBannerActive;

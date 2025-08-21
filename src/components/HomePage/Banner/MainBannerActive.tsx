// src/components/HomePage/Banner/MainBannerActive.tsx
import { useEffect, useMemo, useState } from "react";
import { getMyBirthdayCountdown } from "../../../services/user/friendbirthday";

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
  const [apiName, setApiName] = useState<string | null>(null);

  // 1) 프롭이 없으면 localStorage에서 시도
  useEffect(() => {
    if (!userName) setStoredName(readNameFromStorage());
  }, [userName]);

  // 2) 프롭/스토리지 둘 다 없으면 API 폴백
  useEffect(() => {
    let cancelled = false;
    async function fetchName() {
      if (userName || storedName) return;
      try {
        const res = await getMyBirthdayCountdown();
        if (!cancelled) {
          const n = res?.user?.name;
          if (typeof n === "string" && n.trim()) setApiName(n.trim());
        }
      } catch {
        // 실패 시 조용히 fallbackName 사용
      }
    }
    fetchName();
    return () => { cancelled = true; };
  }, [userName, storedName]);

  const displayName = useMemo(
    () => userName || storedName || apiName || fallbackName,
    [userName, storedName, apiName, fallbackName]
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
        {/* 좌측 모아 캐릭터 */}
        <img
          src={imageSrc}
          alt="모아 캐릭터"
          className="pointer-events-none select-none absolute
                     left-[-55px] top-[-10px] w-[238.55px] h-[238.55px] rotate-[30deg]"
        />

        {/* 타이틀 */}
        <h2
          className="absolute left-[155px] top-[20px] text-white text-[20px] leading-[1.25]"
        >
          <span className="font-bold">{displayName}님</span>을 위한
          <br />
          모아가 진행 중이에요!
        </h2>

        {/* CTA */}
        <div className="absolute right-[18px] bottom-[18px]">
          <span className="text-[13px] text-white pr-2">
            {buttonText} &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainBannerActive;

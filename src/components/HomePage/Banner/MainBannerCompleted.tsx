// src/components/HomePage/Banner/MainBannerCompleted.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getMyBirthdayCountdown } from "../../../services/user/friendbirthday";

type Props = {
  userName?: string;                 // 우선 사용
  buttonText?: string;               // 기본: "모아모아 받으러 가기"
  onClick?: () => void;
  className?: string;
  fallbackName?: string;             // 최종 대체 (기본 "사용자")
};

/** localStorage에서 name 후보를 찾아 반환 */
function readNameFromStorage(): string | null {
  try {
    const directKeys = ["userName", "username", "name"];
    for (const k of directKeys) {
      const v = localStorage.getItem(k);
      if (v && v !== "null" && v !== "undefined") return v;
    }
    // JSON blob에 들어있는 경우 (profile/user/me)
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

const MainBannerCompleted: React.FC<Props> = ({
  userName,
  buttonText = "모아모아 받으러 가기",
  onClick,
  className,
  fallbackName = "사용자",
}) => {
  const [storedName, setStoredName] = useState<string | null>(null);
  const [apiName, setApiName] = useState<string | null>(null);

  // 1) 프롭이 없으면 localStorage
  useEffect(() => {
    if (!userName) {
      setStoredName(readNameFromStorage());
    }
  }, [userName]);

  // 2) 프롭/스토리지 둘 다 없으면 API 폴백 (getMyBirthdayCountdown)
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
        // 실패 시 조용히 무시하고 fallbackName 사용
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
        aria-label="메인 완료 배너"
        className={`relative w-[350px] h-[155px] rounded-[20px] overflow-hidden cursor-pointer shadow 
          bg-gradient-to-br from-[#9C60DC] to-[#E59090] ${className ?? ""}`}
        onClick={onClick}
      >
        {/* 좌측 점선 동그라미 아이콘 */}
        <img
          src="/assets/completed_left.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[-26px] top-[74px] w-[113px] h-[113px] select-none"
        />

        {/* 우측 선물/장식 아이콘 */}
        <img
          src="/assets/completed_right.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[156px] top-[-8px] w-[194px] h-[152px] select-none"
        />

        {/* 타이틀 */}
        <h2 className="absolute left-[21px] top-[54px] text-white">
          <span className="text-[20px] leading-[1] font-bold">
            {displayName}님
          </span>
          <span className="text-[20px] leading-[1]">
            의
            <br />
            생일을 축하합니다!
          </span>
        </h2>

        {/* CTA */}
        <div className="absolute bottom-[9px] right-[18px]">
          <span className="text-[12px] text-white">
            {buttonText} &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainBannerCompleted;

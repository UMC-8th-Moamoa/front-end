// components/Purchase/FreeChargeSection.tsx

import { useState } from "react";
import AdIcon from "../../assets/Ad.svg";

export default function FreeChargeSection() {
  const [adsLeft, setAdsLeft] = useState(5); // 남은 횟수
  const [isPlaying, setIsPlaying] = useState(false); // 광고 재생 중 상태
  const [showBanner, setShowBanner] = useState(false); // 알림 표시 여부

  const triggerRewardBanner = () => {
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000); // 2초 후 알림 숨김
  };

  const handleAdWatch = () => {
    if (adsLeft <= 0 || isPlaying) return;
    setIsPlaying(true);

    // 광고 시청 로직 시뮬레이션 (2초 후 보상)
    setTimeout(() => {
      setAdsLeft((prev) => prev - 1);
      triggerRewardBanner();
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <div className="px-5 py-4 relative">
      {/* 상단 알림 배너 */}
      {showBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-white text-black px-33 py-6 rounded-xl shadow-md text-sm font-medium transition-opacity duration-300">
          1MC 지급 완료!
        </div>
      )}

      <h2 className="text-base text-[#6282E1] font-semibold mb-3">
        광고 보고 몽코인 충전하기
      </h2>

      {/* 광고 카드 */}
      <button
        onClick={handleAdWatch}
        disabled={isPlaying || adsLeft <= 0}
        className="flex items-center p-4 rounded-xl border border-[#E5E5E5] w-full hover:bg-[#F9FAFB] disabled:opacity-50"
      >
        {/* 왼쪽 아이콘 + 남은 횟수 */}
        <div className="flex flex-col items-center w-20 justify-center">
          <img src={AdIcon} alt="Ad icon" width={50} height={50} />
          <span className="text-xs text-[#97B1FF] font-medium mt-1">
            {adsLeft}/5
          </span>
        </div>

        {/* 텍스트 */}
        <div className="ml-4 text-sm font-medium text-black text-left">
          광고 보면 1MC 무료 지급
          {isPlaying && (
            <p className="text-xs mt-1 text-gray-400">(광고 시청 중...)</p>
          )}
        </div>
      </button>

      {/* 안내 문구 */}
      <ul className="mt-6 text-[11px] text-[#B7B7B7] font-base leading-5 list-disc pl-4">
        <li>광고 1회 시청 시 1 몽코인이 지급됩니다.</li>
        <li>
          하루 최대 5회까지 광고 시청이 가능하며, 시청 가능 횟수는 매일 자정에 초기화됩니다.
        </li>
        <li>광고를 끝까지 시청하셔야 몽코인이 지급됩니다.</li>
        <li>
          네트워크 상태에 따라 광고 재생이 원활하지 않을 수 있으며, 이로 인해 충전에
          제한될 수 있습니다.
        </li>
        <li>
          무료로 충전한 몽코인은 앱 내에서만 사용할 수 있으며, 현금화 및 환불이
          불가합니다.
        </li>
      </ul>
    </div>
  );
}
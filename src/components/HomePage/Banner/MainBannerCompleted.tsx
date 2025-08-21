// src/components/HomePage/Banner/MainBannerCompleted.tsx
import React from "react";

type Props = {
  userName?: string;                 // 좌측 타이틀에 들어갈 사용자 이름
  buttonText?: string;               // 하단 우측 CTA 텍스트 (기본: "모아모아 받으러 가기")
  onClick?: () => void;              // 배너 전체 클릭
  className?: string;                // 추가 커스텀 클래스 (선택)
};

const MainBannerCompleted: React.FC<Props> = ({
  userName = "사용자",
  buttonText = "모아모아 받으러 가기",
  onClick,
  className,
}) => {
  return (
    <div className="w-[393px] flex justify-center px-5 py-2">
      <div
        role="button"
        aria-label="메인 완료 배너"
        className={`relative w-[350px] h-[155px] rounded-[20px] overflow-hidden cursor-pointer shadow 
          bg-gradient-to-r from-[#9C60DC] to-[#E59090] ${className ?? ""}`}
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
          className="pointer-events-none absolute left-[156px] top-[-6px] w-[194px] h-[152px] select-none"
        />

        {/* 타이틀 텍스트 (20 / Bold, 2줄) */}
        <h2 className="absolute left-[21px] top-[54px] text-white">
          <span className="text-[20px] leading-[1] font-bold">
            {userName}님의
            <br />
            생일을 축하합니다!
          </span>
        </h2>

        {/* 하단 우측 CTA (12 / Medium) */}
        <div className="absolute bottom-[14px] right-[18px]">
          <span className="text-[12px] font-medium text-white">
            {buttonText} &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainBannerCompleted;

// src/components/HomePage/Banner/MainBanner.tsx
import { useCallback, useMemo } from "react";
import {
  MainBannerImage,
} from "../../../services/banner/bannerassets";
import type { MainBannerProps } from "../../../services/banner/banner";
import clsx from "clsx";

import MainBannerActive from "./MainBannerActive";
import MainBannerCompleted from "./MainBannerCompleted";

/**
 * 메인배너: 상황에 따라 1개만 노출
 * - my_in_progress  : 진행중 배너 (이름 포함)
 * - birthday_today  : 오늘 생일 배너 (이름 포함)
 * - balance / participating / default : PNG 이미지 배너
 */
const MainBanner = ({ payload, userName, onClick }: MainBannerProps) => {
  // payload 없을 때 안전 가드
  if (!payload) {
    return (
      <div className="w-[350px] h-[155px] rounded-[20px] bg-gray-100 animate-pulse" />
    );
  }

  const handleClick = useCallback(() => {
    onClick?.(payload.moaId ?? null, payload.type);
  }, [onClick, payload.moaId, payload.type]);

  // 이름이 필요한 타입은 전용 컴포넌트 사용
  if (payload.type === "my_in_progress") {
    return (
      <MainBannerActive
        userName={userName}
        buttonText={payload.actionText || "모아모아 보러가기"}
        onClick={handleClick}
        // 내부에서 /assets/Moa.png 를 기본 사용
      />
    );
  }

  if (payload.type === "birthday_today") {
    return (
      <MainBannerCompleted
        userName={userName}
        buttonText={payload.actionText || "모아모아 받으러 가기"}
        onClick={handleClick}
      />
    );
  }

  // 이미지 배너 (balance / participating / default)
  const imgSrc = useMemo(() => {
    const key = (payload.type === "participating"
      ? "participating"
      : (payload.type as keyof typeof MainBannerImage)) as keyof typeof MainBannerImage;

    return MainBannerImage[key] ?? MainBannerImage.default;
  }, [payload.type]);

  return (
    <div
      className={clsx(
        "w-[350px] h-[155px] rounded-[20px] overflow-hidden cursor-pointer"
      )}
      onClick={handleClick}
    >
      <img
        src={imgSrc}
        alt="메인 배너"
        className="w-full h-full object-cover rounded-[20px]"
      />
    </div>
  );
};

export default MainBanner;

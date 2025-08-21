// src/services/banner/route.ts
import type { MainBannerType } from "./bannerassets";

type Params = {
  type: MainBannerType;
  moaId: number | null;
};

export type MainBannerDestination = {
  path: string;
  state?: Record<string, any>;
};

// 내부 유틸: participation 경로 빌더
function buildParticipationPath(moaId: number | null | undefined): string {
  const id = Number(moaId);
  return Number.isFinite(id) && id > 0
    ? `/myparticipation?eventId=${id}`
    : `/myparticipation`;
}

/** 배너 타입에 따른 목적지 계산 */
export function getMainBannerDestination({ type, moaId }: Params): MainBannerDestination {
  switch (type) {
    case "my_in_progress":
      // 나의 ParticipationPage (+ eventId 전달)
      return { path: buildParticipationPath(moaId) };

    case "birthday_today":
      // PickGiftPage
      return { path: "/pick-gift" };

    case "participating":
      // 홈으로 가서 UpcomingList 위치로 스크롤
      return { path: "/home", state: { scrollTo: "upcoming" } };

    case "balance":
      // RemainMoneySelectPage
      return { path: "/remain-money-select" };

    case "default":
    default:
      return { path: "/home" };
  }
}

/** 바로 navigate까지 해주는 헬퍼 (선택) */
export function navigateByMainBanner(
  navigate: (to: string, opts?: { state?: any; replace?: boolean }) => void,
  params: Params
) {
  const { path, state } = getMainBannerDestination(params);
  navigate(path, state ? { state } : undefined);
}

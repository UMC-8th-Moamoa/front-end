// public 폴더 기준 정적 PNG 경로 매핑 + 텍스트 템플릿/해석 유틸

export type MainBannerType =
  | "balance"
  | "birthday_today"
  | "my_in_progress"
  | "participating"
  | "default";

export type SubBannerType = "participating" | "certification" | "default";

// public/assets 아래에 배치해줘
export const MainBannerImage: Record<
  Exclude<MainBannerType, "birthday_today" | "my_in_progress">,
  string
> = {
  default: "/assets/default.GIF",
  balance: "/assets/balance.svg",
  participating: "/assets/participating.svg",
};

export const SubBannerImage: Record<SubBannerType, string> = {
  default: "/assets/default.png",
  certification: "/assets/certification.png",
  participating: "/assets/DefaultProfile.svg",
};

// 텍스트 템플릿 치환 유틸
export const fillName = (template: string, name?: string | null) =>
  name ? template.replaceAll("{name}", name) : template;

// 메인배너 타입 중 이름 치환이 필요한 타입
export const MAIN_NEEDS_NAME: MainBannerType[] = [
  "birthday_today",
  "my_in_progress",
];

// 서브배너 타입 중 이름 치환이 필요한 타입
export const SUB_NEEDS_NAME: SubBannerType[] = ["participating"];

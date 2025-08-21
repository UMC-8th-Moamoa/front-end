import instance from "../../api/axiosInstance";
import type { MainBannerType, SubBannerType } from "./bannerassets";


/* ========= 타입 ========= */
export type ParticipationStatus = "participating" | "not_participating";
export type EventStatus = "active" | "completed";

export interface MoaItem {
  id: number;
  birthdayPersonName: string;
  birthdayPersonPhoto: string | null;
  participationStatus: ParticipationStatus;
  eventStatus: EventStatus;
}

export interface Pagination {
  Next: boolean;
  Prev: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
}

export interface MainBannerPayload {
  type: MainBannerType;
  title: string;
  description: string;
  actionText: string;
  moaId: number | null;
}

export interface SubBannerPayload {
  type: SubBannerType;
  title: string;
  description: string;
  actionText: string;
  moaId: number;
}

export interface MoaBannerResponse {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: {
    moas: MoaItem[];
    pagination: Pagination;
    mainBanner: MainBannerPayload;
    subBanners: SubBannerPayload[];
  };
}

/* ===== 컴포넌트 프롭스 (요청 스타일) ===== */
export type SubBannerVariant = "default" | "highlight" | "imageOnly";

export interface MainBannerProps {
  payload: MainBannerPayload;     // API에서 받은 그대로
  userName?: string | null;       // 텍스트 치환용 (birthday_today, my_in_progress)
  onClick?: (moaId: number | null, type: MainBannerType) => void;
}

export interface SubBannerProps {
  imageSrc: string | "user";      // "user"면 동그란 사용자 프로필 박스
  content: string;                // 한 줄/두 줄 텍스트
  buttonText?: string;            // 우측 하단 작은 버튼 텍스트
  variant?: SubBannerVariant;     // default | highlight | imageOnly
  onClick?: () => void;
}

/* ========= API ========= */

export interface FetchMoasParams {
  limit?: number;                 // 기본 1
  cursor?: string | null;         // 기본 null
  direction?: "next" | "prev";    // 기본 next
}

/** GET /api/moas?limit&cursor&direction */
export async function fetchMoasAndBanners(params: FetchMoasParams = {}) {
  const { limit, cursor, direction } = params;

  // 서버 프록시가 /api 로 잡혀 있으면 baseURL에 의해 "/moas"가 "/api/moas"로 전달됨
  const res = await instance.get<MoaBannerResponse>("/moas", {
    params: {
      ...(limit !== undefined ? { limit } : {}),
      ...(cursor ? { cursor } : {}),
      ...(direction ? { direction } : {}),
    },
  });

  if (res.data.resultType !== "SUCCESS" || !res.data.success) {
    throw new Error("FAILED_TO_FETCH_MOAS");
  }

  return res.data.success;
}

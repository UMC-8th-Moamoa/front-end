// src/services/wishlist.ts

import instance from "../api/axiosInstance";


/** ====== 서버/쿼리 타입 ====== */
export type WishlistSort = "created_at" | "price_desc" | "price_asc";
export type WishlistVisibility = "public" | "private";

/** 서버가 주는 DTO (Swagger 예시 기준) */
export interface WishlistDto {
  id: number;
  productName: string;
  productImageUrl: string | null;
  price: number;
  visibility?: WishlistVisibility; // 명세에 없으면 안 내려올 수 있어 optional
  createdAt?: string;
}

/** unwrapped 응답 (Swagger 예시) */
export interface WishlistPageRaw {
  content: WishlistDto[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

/** wrapped 응답(resultType/success)도 대비 */
export interface WishlistListWrapped {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    content: WishlistDto[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

/** ====== UI에서 쓰기 쉬운 형태 ====== */
export interface WishlistUiItem {
  id: number;
  title: string;                 // productName
  imageSrc: string;              // productImageUrl (fallback 포함)
  priceText: string;             // "100,000원"
  price: number;                 // ✅ 숫자 가격(정렬/합계용)
  openOption: "locked" | "unlocked"; // visibility 매핑
}

export interface WishlistPage {
  items: WishlistUiItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

/** DTO -> UI 매핑 */
const toUi = (dto: WishlistDto): WishlistUiItem => {
  const imageSrc = dto.productImageUrl ?? "/assets/gift_sample.svg";
  const priceNumber = Number(dto.price ?? 0);
  const priceText = `${priceNumber.toLocaleString()}원`;
  const openOption: "locked" | "unlocked" =
    dto.visibility === "private" ? "locked" : "unlocked";

  return {
    id: dto.id,
    title: dto.productName,
    imageSrc,
    priceText,
    price: priceNumber,           // ✅ 추가
    openOption,
  };
};

/** 응답(any) -> 표준 페이지로 파싱 (wrapped/unwrapped 모두 대응) */
const parsePage = (data: any, fallbackPage: number, fallbackSize: number): WishlistPage => {
  // wrapped
  if (data?.resultType && data?.success) {
    const s = (data as WishlistListWrapped).success!;
    const items = (s.content ?? []).map(toUi);
    return {
      items,
      page: s.page ?? fallbackPage,
      size: s.size ?? fallbackSize,
      totalPages: s.totalPages ?? 0,
      totalElements: s.totalElements ?? items.length,
    };
  }
  // unwrapped (Swagger 예시)
  if (Array.isArray(data?.content)) {
    const r = data as WishlistPageRaw;
    const items = (r.content ?? []).map(toUi);
    return {
      items,
      page: r.page ?? fallbackPage,
      size: r.size ?? fallbackSize,
      totalPages: r.totalPages ?? 0,
      totalElements: r.totalElements ?? items.length,
    };
  }
  // 방어
  return { items: [], page: fallbackPage, size: fallbackSize, totalPages: 0, totalElements: 0 };
};

/** 정렬 드롭다운 문자열 -> API sort 값 (필요 시 네 UI에 맞게 수정) */
export const mapSortLabelToApi = (label: string): WishlistSort => {
  if (label === "가격↑") return "price_asc";
  if (label === "가격↓") return "price_desc";
  return "created_at";
};

/** ====== API: 나의 위시리스트 목록 조회 ====== */
export async function getMyWishlists(params: {
  page?: number;
  size?: number;
  sort?: WishlistSort;
  visibility?: WishlistVisibility;
} = {}): Promise<WishlistPage> {
  const { page = 1, size = 10, sort = "created_at", visibility } = params;

  const { data } = await instance.get("/wishlists", {
    params: { page, size, sort, visibility },
  });

  return parsePage(data, page, size);
}

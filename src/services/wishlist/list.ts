// src/services/wishlist/list.ts
import instance from "../../api/axiosInstance";

/** ====== 서버/쿼리 타입 ====== */
export type WishlistSort = "created_at" | "price_desc" | "price_asc";

/** 서버 DTO — visibility 제거, isPublic 만 사용 */
export interface WishlistDto {
  id: number;
  productName: string;
  productImageUrl: string | null;
  price: number;
  isPublic?: boolean | null;      // 공개 여부 (없으면 기본 false로 처리)
  createdAt?: string | null;
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
  title: string;           // productName
  imageSrc: string;        // fallback 포함
  priceText: string;       // "100,000원"
  price: number;           // 숫자
  isPublic: boolean;       // 🔥 공개 여부(단일 진실 소스)
}

/** 페이지 타입 */
export interface WishlistPage {
  items: WishlistUiItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

/** DTO -> UI 매핑 (isPublic만 사용) */
const toUi = (dto: WishlistDto): WishlistUiItem => {
  const imageSrc = dto.productImageUrl ?? "/assets/gift_sample.svg";
  const priceNumber = Number(dto.price ?? 0);
  const priceText = `${priceNumber.toLocaleString()}원`;
  const isPublic = Boolean(dto.isPublic ?? false); // 정의 안되면 기본 false(비공개)

  return {
    id: dto.id,
    title: dto.productName,
    imageSrc,
    priceText,
    price: priceNumber,
    isPublic,
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
  // unwrapped
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

/** 정렬 드롭다운 문자열 -> API sort 값 */
export const mapSortLabelToApi = (label: string): WishlistSort => {
  if (label === "높은 가격순") return "price_desc";
  if (label === "낮은 가격순") return "price_asc";
  return "created_at"; // 등록순
};

/** ====== API: 나의 위시리스트 목록 조회 ====== */
export async function getMyWishlists(params: {
  page?: number;
  size?: number;
  sort?: WishlistSort;
  /** 공개/비공개 필터는 클라이언트단에서 isPublic으로 처리(서버가 지원하면 별도 엔드포인트 사용) */
} = {}): Promise<WishlistPage> {
  const { page = 1, size = 10, sort = "created_at" } = params;

  const { data } = await instance.get("/wishlists", {
    params: { page, size, sort },
  });

  return parsePage(data, page, size);
}

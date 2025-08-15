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
  isPublic?: boolean | null; // 공개 여부 (없으면 기본 false로 처리)
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
  title: string;      // productName
  imageSrc: string;   // fallback 포함
  priceText: string;  // "100,000원"
  price: number;      // 숫자
  isPublic: boolean;  // 🔥 공개 여부(단일 진실 소스)
}

/** 페이지 타입 */
export interface WishlistPage {
  items: WishlistUiItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

/** 공통 un-wrapper */
const unwrap = (data: any) =>
  (data?.resultType && data?.success ? data.success : data) ?? data;

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
const parsePage = (
  data: any,
  fallbackPage: number,
  fallbackSize: number
): WishlistPage => {
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
  return {
    items: [],
    page: fallbackPage,
    size: fallbackSize,
    totalPages: 0,
    totalElements: 0,
  };
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
} = {}): Promise<WishlistPage> {
  const { page = 1, size = 10, sort = "created_at" } = params;
  const { data } = await instance.get("/wishlists", {
    params: { page, size, sort },
  });
  return parsePage(data, page, size);
}

/* =====================[ 참여자 쪽: 수신자 위시리스트 조회 ]===================== */

export type RecipientWishlistItem = {
  id: number;
  productName: string;
  productImageUrl: string;
  price: number;
  productUrl: string;
};

export type RecipientWishlistPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

type RawResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    event: {
      id: number;
      birthdayPerson: { id: number; name: string };
    };
    wishlists: RecipientWishlistItem[];
    pagination: RecipientWishlistPagination;
  };
};

/** ---- UI에서 바로 쓰기 좋은 형태 ---- */
export type WishlistUi = { id: number; name: string; image: string };

export async function fetchRecipientWishlists(
  eventId: number,
  page = 1,
  size = 10
): Promise<{
  recipientName: string;
  items: RecipientWishlistItem[];
  pagination: RecipientWishlistPagination;
}> {
  const { data } = await instance.get<RawResponse>(
    `/birthdays/events/${eventId}/wishlists`,
    { params: { page, size } }
  );

  if (data.resultType !== "SUCCESS" || !data.success) {
    return {
      recipientName: "",
      items: [],
      pagination: { currentPage: page, totalPages: 0, totalItems: 0 },
    };
  }

  const { birthdayPerson } = data.success.event ?? {
    birthdayPerson: { name: "" } as any,
  };
  return {
    recipientName: birthdayPerson?.name ?? "",
    items: data.success.wishlists ?? [],
    pagination: data.success.pagination,
  };
}

/** MemberWishList가 쓰기 좋은 간단 매핑 버전 */
export async function getRecipientWishlistUi(
  eventId: number,
  page = 1,
  size = 10
): Promise<{
  recipientName: string;
  items: WishlistUi[];
  pagination: RecipientWishlistPagination;
}> {
  const res = await fetchRecipientWishlists(eventId, page, size);
  return {
    recipientName: res.recipientName,
    items: (res.items ?? []).map((w) => ({
      id: w.id,
      name: w.productName,
      image: w.productImageUrl,
    })),
    pagination: res.pagination,
  };
}

/* =====================[ 생성/수정 ]===================== */

export type CreateWishlistManualInput = {
  productName: string;
  price: number;
  /** 서버는 productImageUrl을 기대. 기존 imageUrl로 넘겨도 매핑해 줌 */
  productImageUrl?: string | null;
  imageUrl?: string | null; // 하위호환
  isPublic: boolean;
};

export type CreateWishlistByUrlInput = {
  url: string;
  isPublic: boolean;
};

export type UpdateWishlistBody = {
  productName?: string;
  price?: number;
  productImageUrl?: string | null;
  isPublic?: boolean;
};

/** ====== API: 수동 입력 등록 (insertType: "MANUAL") ====== */
export async function createWishlistManual(
  input: CreateWishlistManualInput
): Promise<WishlistDto> {
  const productImageUrl =
    input.productImageUrl ?? input.imageUrl ?? null; // 하위호환 처리

  const payload = {
    insertType: "MANUAL",
    productName: input.productName,
    price: input.price,
    productImageUrl, // ✅ 스웨거 스펙 키
    isPublic: input.isPublic,
  };

  const { data } = await instance.post("/wishlists", payload);
  const res = unwrap(data);

  return {
    id: res.id,
    productName: res.productName,
    productImageUrl: res.productImageUrl ?? res.imageUrl ?? null,
    price: Number(res.price ?? 0),
    isPublic: Boolean(res.isPublic ?? input.isPublic),
    createdAt: res.createdAt ?? null,
  };
}

/** ====== API: URL 자동 입력 등록 (insertType: "URL") ======
 *  - 오버로드 지원: createWishlistByUrl({url,isPublic}) 또는 createWishlistByUrl(url, isPublic)
 */
export function createWishlistByUrl(
  url: string,
  isPublic: boolean
): Promise<WishlistDto>;
export function createWishlistByUrl(
  input: CreateWishlistByUrlInput
): Promise<WishlistDto>;
export async function createWishlistByUrl(
  arg1: string | CreateWishlistByUrlInput,
  arg2?: boolean
): Promise<WishlistDto> {
  const payload =
    typeof arg1 === "string"
      ? { insertType: "URL", url: arg1, isPublic: !!arg2 }
      : { insertType: "URL", ...arg1 };

  // url 필수값 방어
  if (!payload.url || typeof payload.url !== "string" || !payload.url.trim()) {
    throw new Error("상품 URL이 비어 있습니다. URL을 입력해 주세요.");
  }

  // 실제 전송 payload 로그
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[createWishlistByUrl] POST /wishlists payload:", payload);
  }

  const { data } = await instance.post("/wishlists", payload);
  const res = unwrap(data);

  return {
    id: res.id,
    productName: res.productName,
    productImageUrl: res.productImageUrl ?? null,
    price: Number(res.price ?? 0),
    isPublic: Boolean(res.isPublic ?? payload.isPublic),
    createdAt: res.createdAt ?? null,
  };
}

/** ====== API: 위시리스트 수정 ====== */
export async function updateWishlist(
  id: number,
  body: UpdateWishlistBody
): Promise<WishlistDto> {
  const { data } = await instance.patch(`/wishlists/${id}`, body);
  const res = unwrap(data);

  return {
    id: res.id ?? id,
    productName: res.productName ?? body.productName ?? "",
    productImageUrl: res.productImageUrl ?? body.productImageUrl ?? null,
    price: Number(res.price ?? body.price ?? 0),
    isPublic: Boolean(res.isPublic ?? body.isPublic ?? false),
    createdAt: res.createdAt ?? null,
  };
}

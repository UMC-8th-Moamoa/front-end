// services/birthday/mybirthday.ts
import instance from "../../api/axiosInstance";

/** ---------- Types: 내 생일 이벤트 요약 ---------- */
export type MyBirthdayEventParticipant = {
  id: number;
  name: string;
  photo: string | null;
  participatedAt: string; // ISO
};

export type MyBirthdayEvent = {
  eventId: number;
  totalAmount: number;
  participantCount: number;
  participants: MyBirthdayEventParticipant[];
  deadline: string;      // ISO
  daysRemaining: number; // D-값
  birthdayDate: string;  // "YYYY-MM-DD"
  status: "active" | "expired" | "pending" | string;
};

/** ---------- API: 내 생일 이벤트 요약 ---------- */
// baseURL에 이미 "/api"가 있으므로 여기서는 "/api"를 붙이지 않음
export async function getMyBirthdayEvent() {
  const { data } = await instance.get("/birthdays/me/event");
  return data.success as MyBirthdayEvent;
}

/** ---------- Types: 내 이벤트 위시리스트 ---------- */
export type WishlistSortBy =
  | "CREATED_AT"   // 등록순(기본)
  | "VOTE_COUNT"   // 친구 추천순(투표 수)
  | "PRICE_DESC"   // 높은 가격순
  | "PRICE_ASC";   // 낮은 가격순

export type WishlistProduct = {
  itemId: number;
  name: string;
  price: number;         // 원 단위
  image: string;         // 썸네일 URL
  isSelected: boolean;   // 서버상 현재 선택 여부
  addedAt: string;       // ISO
  voteCount: number;
};

export type WishlistPagination = {
  hasNext: boolean;
  nextCursor: string | null;
  totalCount: number;
};

export type MyEventWishlist = {
  currentAmount: number;        // 현재 모인 금액
  products: WishlistProduct[];  // 아이템 목록
  pagination: WishlistPagination;
  selectedItems: number[];      // 서버 기준 선택된 itemId 목록
  totalSelectedAmount: number;  // 서버 기준 선택 합계
  remainingAmount: number;      // 서버 기준 잔액(= currentAmount - totalSelectedAmount)
};

/** ---------- API: 내 이벤트 위시리스트 ---------- */
export async function getMyEventWishlist(params?: {
  sortBy?: WishlistSortBy;      // 기본: CREATED_AT
  cursor?: string | null;       // 다음 페이지 커서
  limit?: number;               // 기본: 10
}): Promise<MyEventWishlist> {
  const { sortBy = "CREATED_AT", cursor, limit = 10 } = params ?? {};
  const { data } = await instance.get("/birthdays/me/event/wishlist", {
    params: { sortBy, cursor, limit },
  });
  // 스웨거 200 성공 스키마 그대로 반환
  return data.success as MyEventWishlist;
}

/** ---------- (편의) UI 매핑 타입 & 래퍼 ---------- */
/* PickGiftPage에서 쓰는 카드 아이템 형태 */
export type WishlistUiItem = {
  id: number;
  imageSrc: string;
  title: string;
  price: number;        // 숫자 그대로(표시는 컴포넌트에서 toLocaleString 등 처리)
  openOption?: boolean; // UI 플래그(선택 사항) – 서버 필드는 없으니 기본 false로 매핑
};

/**
 * 기존 코드 호환용 래퍼
 * - 사용 예: const page = await getMyWishlists({ size: 50 }); setList(page.items)
 * - page/size는 커서 기반 API에 맞춰 내부적으로 limit만 사용, cursor는 필요 시 확장 가능
 */
export async function getMyWishlists(params?: {
  page?: number;              // (무시됨) 커서 기반
  size?: number;              // -> limit 로 사용
  sortBy?: WishlistSortBy;    // 기본 CREATED_AT
  cursor?: string | null;     // 다음 페이지 커서 필요 시 전달
}): Promise<{
  items: WishlistUiItem[];
  hasNext: boolean;
  nextCursor: string | null;
  // 보너스 정보(원하면 사용)
  currentAmount: number;
  selectedItems: number[];
  totalSelectedAmount: number;
  remainingAmount: number;
}> {
  const { size = 10, sortBy = "CREATED_AT", cursor = null } = params ?? {};
  const res = await getMyEventWishlist({ limit: size, sortBy, cursor });

  const items: WishlistUiItem[] = (res.products ?? []).map((p) => ({
    id: p.itemId,
    imageSrc: p.image,
    title: p.name,
    price: p.price,
    openOption: false,
  }));

  return {
    items,
    hasNext: res.pagination?.hasNext ?? false,
    nextCursor: res.pagination?.nextCursor ?? null,
    currentAmount: res.currentAmount,
    selectedItems: res.selectedItems ?? [],
    totalSelectedAmount: res.totalSelectedAmount ?? 0,
    remainingAmount: res.remainingAmount ?? 0,
  };
}


export type SelectWishlistResult = {
  wishlistIds: number[];
  totalSelectedAmount: number;
  currentAmount: number;
  remainingAmount: number;
};

export async function selectMyWishlistItems(
  wishlistIds: number[]
): Promise<SelectWishlistResult> {
  const { data } = await instance.put("/birthdays/me/event/wishlist/select", {
    wishlistIds, // 요청 바디
  });

  // 응답 포맷 호환 처리: {success:true, data:{...}} or {resultType:'SUCCESS', success:{...}}
  const payload =
    data?.data ??
    data?.success?.data ??
    data?.success ??
    {};

  const ids = payload.wishlistIds ?? payload.wishlistId ?? [];
  return {
    wishlistIds: Array.isArray(ids) ? ids : [],
    totalSelectedAmount: Number(payload.totalSelectedAmount ?? 0),
    currentAmount: Number(payload.currentAmount ?? 0),
    remainingAmount: Number(payload.remainingAmount ?? 0),
  };
}


export type SettlementFormLink = {
  formUrl: string;                    // 구글폼 링크
  message?: string;                   // 화면 문구
  paymentSummary?: {
    fundAmount: number;               // 우리 쪽에서 송금 예정 금액 (화면에 굵게 표기)
    additionalAmount: number;         // 생일자 추가 부담액
    totalAmount: number;              // 총 정산 금액
  };
  expiresAt?: string;                 // 만료 시각(옵션)
  // 백엔드가 다른 키로 줄 수도 있어 대비(googleFormUrl 등)
  [key: string]: any;
};

/**
 * GET /birthdays/me/event/formlink
 * - 응답 포맷이 `{"success":true,"data":{...}}` 혹은 `{"success":{...}}` 등일 수 있어
 *   안전하게 꺼내도록 처리
 */
export async function getSettlementFormLink(): Promise<SettlementFormLink> {
  const { data } = await instance.get("/birthdays/me/event/formlink");

  // 응답 안전 추출
  const payload =
    (typeof data?.success === "object" && data.success) ||
    data?.data ||
    data?.success ||
    data;

  // 서로 다른 키 대응(formUrl | googleFormUrl)
  const formUrl: string = payload?.formUrl ?? payload?.googleFormUrl ?? "";

  const paymentSummary =
    payload?.paymentSummary ??
    undefined;

  return {
    formUrl,
    message: payload?.message,
    paymentSummary,
    expiresAt: payload?.expiresAt,
    ...payload,
  };
}
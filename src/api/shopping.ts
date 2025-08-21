// src/api/shopping.ts
import api from "../api/axiosInstance";

/** ---------- Types (server payloads) ---------- */
export type ShopItem = {
  item_no: number;
  name: string;
  price: number;
  image?: string;
};

export type ItemListResponse = {
  success: boolean;
  num: number;
  item: ShopItem[];
};

/** 보관함(내 아이템) — 반드시 보관함의 안정 ID(holditem_id)를 사용 */
export type UserItem = {
  holditem_id: number;                 // 표준화된 보관함 아이템 고유번호
  category: "font" | "paper" | "seal";
  name: string;
  image?: string;
  item_no?: number;                    // 상점 상품 ID(참고용)
  price?: number;
  description?: string;
  event?: boolean;
  purchasedAt?: string;
};

export type UserItemsResponse = {
  success: boolean;
  num: number;
  itemListEntry: UserItem[];
};

/** 서버 공통 래퍼 */
type Envelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

/** 목록 페이로드는 item 또는 itemListEntry로 내려올 수 있음 */
type ItemListPayload = {
  success?: boolean;
  num?: number;
  item?: ShopItem[];
  itemListEntry?: ShopItem[];
};

/** 서버가 보관함을 다양한 키로 내려줄 수 있음 → 모두 흡수 */
type RawUserItem = {
  // 보관함 안정 ID 후보들
  holditem_id?: number | string;
  holditem_no?: number | string;
  // 상점 상품 ID
  item_no?: number | string;

  category: "font" | "paper" | "seal";
  name?: string;
  image?: string;

  // 신규 /letters/user/items 전용 필드
  price?: number;
  description?: string;
  event?: boolean;
  purchasedAt?: string;
};

type UserItemsPayload = {
  success?: boolean;
  num?: number;
  item?: RawUserItem[];
  itemListEntry?: RawUserItem[];
  userItems?: RawUserItem[]; // ✅ 신규 스펙
};

/** ---------- Normalizers ---------- */
function normalizeItemList(p?: ItemListPayload | null): ItemListResponse {
  const list = p?.itemListEntry ?? p?.item ?? [];
  return {
    success: Boolean(p?.success ?? Array.isArray(list)),
    num: Number(p?.num ?? list.length),
    item: list,
  };
}

function toNumberOrZero(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function normalizeUserItems(p?: UserItemsPayload | null): UserItemsResponse {
  const anyP = (p as any) ?? {};
  const raw: RawUserItem[] =
    anyP.userItems ?? anyP.itemListEntry ?? anyP.item ?? [];

  const mapped: UserItem[] = raw.map((u) => {
    // 우선순위: holditem_id → holditem_no → item_no
    const stableId =
      toNumberOrZero(u.holditem_id) ||
      toNumberOrZero(u.holditem_no) ||
      toNumberOrZero(u.item_no);

    return {
      holditem_id: stableId,
      category: u.category as UserItem["category"],
      name: u.name ?? "",
      image: u.image,
      item_no: toNumberOrZero(u.item_no) || undefined,
      price: typeof u.price === "number" ? u.price : undefined,
      description: u.description,
      event: typeof u.event === "boolean" ? u.event : undefined,
      purchasedAt: u.purchasedAt,
    };
  });

  return {
    success: Boolean(anyP.success ?? Array.isArray(raw)),
    num: Number(anyP.num ?? mapped.length),
    itemListEntry: mapped,
  };
}

/** ---------- API functions ---------- */

/** 쇼핑 아이템 목록 */
export async function fetchItemList(
  category: "font" | "paper" | "seal",
  num: number
): Promise<ItemListResponse> {
  const { data } = await api.get<Envelope<ItemListPayload>>(
    "/shopping/item_list",
    {
      params: { category, num, _t: Date.now() },
      headers: { "Cache-Control": "no-cache" },
    }
  );
  return normalizeItemList((data as any)?.success);
}

/**
 * 내 보관함 아이템 목록 (JWT 필요)
 * 1순위: /api/letters/user/items  (신규 표준)
 * 2순위: /shopping/user_item      (구 버전 폴백)
 */
export async function fetchUserItems(num: number): Promise<UserItemsResponse> {
  // 1) 신규 엔드포인트 시도
  try {
    const { data } = await api.get("/letters/user/items", {
      params: { num, _t: Date.now() },
      headers: { "Cache-Control": "no-cache" },
      // 일부 서버에서 200이 아닌 status를 낼 수 있어 명시
      validateStatus: (s) => s >= 200 && s < 500,
    });

    // 래퍼 or 맨바디 모두 수용
    const payload =
      (data as any)?.success ??
      (data as any); // 맨바디 { userItems: [...] } 지원
    if (payload?.userItems || payload?.item || payload?.itemListEntry) {
      return normalizeUserItems(payload);
    }
    // 정상 스펙이 아니면 폴백 시도
  } catch {
    // 무시하고 폴백
  }

  // 2) 구 엔드포인트 폴백
  const { data: old } = await api.get<Envelope<UserItemsPayload>>(
    "/shopping/user_item",
    {
      params: { num, _t: Date.now() },
      headers: { "Cache-Control": "no-cache" },
    }
  );

  // 구 엔드포인트의 래퍼/맨바디 흡수
  const payload = (old as any)?.success ?? (old as any);
  return normalizeUserItems(payload);
}

/** 상세 보기 — 스웨거 준수: /shopping/item_detail?id= */
export async function fetchItemDetail(opts: {
  id: number;
}): Promise<{ name?: string; image?: string; detail?: string; price?: number }> {
  const { data } = await api.get("/shopping/item_detail", {
    params: { id: opts.id, _t: Date.now() },
    headers: { "Cache-Control": "no-cache" },
  });

  // 예시: { success: true, itemDetailEntry: {...} }
  const entry = (data as any)?.itemDetailEntry ?? {};
  return {
    name: entry?.name,
    image: entry?.image,
    detail: entry?.detail,
    price: entry?.price,
  };
}

/** 구매 API */
export async function buyItem(payload: {
  category: "font" | "paper" | "seal";
  user_id: string;
  item_no: number;
  price: number;
  event: boolean;
}) {
  return api.post("/shopping/item_buy", payload);
}

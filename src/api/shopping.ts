// src/api/shopping.ts
import api from '../api/axiosInstance';

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

/** 보관함(내 아이템) */
export type UserItem = {
  holditem_id: number;                 // 표준화된 보관함 아이템 고유번호
  category: 'font' | 'paper' | 'seal';
  name: string;                        // 서버가 주면 사용, 없으면 빈 문자열
  image?: string;
  item_no?: number;                    // 원본 아이템 번호(있으면 유지)
};

export type UserItemsResponse = {
  success: boolean;
  num: number;
  itemListEntry: UserItem[];
};

/** 서버 공통 래퍼 */
type Envelope<T> = {
  resultType: 'SUCCESS' | 'FAIL';
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
  holditem_id?: number;
  holditem_no?: number;
  item_no?: number;
  category: 'font' | 'paper' | 'seal'; // envelope 제거
  name?: string;
  image?: string;
  user_id?: string;
};

type UserItemsPayload = {
  success?: boolean;
  num?: number;
  item?: RawUserItem[];
  itemListEntry?: RawUserItem[];
  userItems?: RawUserItem[];
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

function normalizeUserItems(p?: UserItemsPayload | null): UserItemsResponse {
  const anyP = (p as any) ?? {};
  const raw: RawUserItem[] =
    anyP.itemListEntry ?? anyP.item ?? anyP.userItems ?? [];

  const mapped: UserItem[] = raw.map((u) => {
    const holdId = u.holditem_id ?? u.holditem_no ?? u.item_no ?? 0;
    return {
      holditem_id: Number(holdId),
      category: u.category as UserItem['category'],
      name: u.name ?? '',
      image: u.image,
      item_no: u.item_no,
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
  category: 'font' | 'paper' | 'seal',
  num: number
): Promise<ItemListResponse> {
  const { data } = await api.get<Envelope<ItemListPayload>>('/shopping/item_list', {
    params: { category, num, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });
  return normalizeItemList((data as any)?.success);
}

/** 내 보관함 아이템 목록 (JWT 필요) */
export async function fetchUserItems(num: number): Promise<UserItemsResponse> {
  const { data } = await api.get<Envelope<UserItemsPayload>>('/shopping/user_item', {
    params: { num, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });
  return normalizeUserItems((data as any)?.success ?? (data as any));
}

/** 상세 보기 */
export async function fetchItemDetail(opts: {
  category: 'font' | 'paper' | 'seal';
  id: number;
}): Promise<{ name?: string; image?: string; detail?: string; price?: number }> {
  const { data } = await api.get('/shopping/item_list', {
    params: { category: opts.category, id: opts.id, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });

  const payload = (data as any)?.success ?? (data as any);
  const arr = Array.isArray(payload?.item) ? payload.item : [];
  const first = arr[0] ?? {};
  return {
    name: first?.name,
    image: first?.image,
    detail: first?.detail,
    price: first?.price,
  };
}

/** 구매 API */
export async function buyItem(payload: {
  category: 'font' | 'paper' | 'seal';

  user_id: string;
  item_no: number;
  price: number;
  event: boolean;
}) {
  return api.post('/shopping/item_buy', payload);

}
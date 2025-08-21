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
  holditem_id: number;
  category: 'font' | 'paper' | 'seal';
  name: string;
  image?: string;
  item_no?: number;
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
  category: 'font' | 'paper' | 'seal';
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
  const list = (p?.itemListEntry ?? p?.item ?? []).map((it: any) => ({
    ...it,
    image: it.image ?? it.imageUrl ?? it.img ?? null,
  }));
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
      name: u.name ?? '', // 빈 값이면 이후 보강 단계에서 채움
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
  return normalizeItemList((data as any)?.success ?? (data as any));
}

/** 상세 보기(단건) */
export async function fetchItemDetail(opts: {
  category: 'font' | 'paper' | 'seal';
  id: number;
}) {
  const { data } = await api.get('/shopping/item_detail', {
    params: { category: opts.category, id: opts.id, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });

  const payload = (data as any)?.success ?? (data as any);
  const arr = Array.isArray(payload?.item) ? payload.item : [];
  const first: any = arr[0] ?? {};

  return {
    name: first?.name,
    image: first?.image ?? first?.imageUrl ?? first?.img ?? null,
    detail: first?.detail ?? first?.description ?? '',
    price: first?.price,
  };
}

/** 이름/이미지 비어있는 보관함 아이템 보강 */
async function enrichUserItems(items: UserItem[]): Promise<UserItem[]> {
  // 보강 필요한 아이템만 추출
  const targets = items.filter(
    (u) => (!u.name || !u.name.trim()) && u.item_no != null
  );
  if (!targets.length) return items;

  // (category|item_no) 기준으로 중복 제거
  const uniqueKeys = Array.from(
    new Set(targets.map((u) => `${u.category}|${u.item_no}`))
  );

  // 상세 병렬 조회
  const detailMap = new Map<string, { name?: string; image?: string }>();
  await Promise.all(
    uniqueKeys.map(async (key) => {
      const [category, idStr] = key.split('|');
      const id = Number(idStr);
      try {
        const detail = await fetchItemDetail({
          category: category as 'font' | 'paper' | 'seal',
          id,
        });
        detailMap.set(key, { name: detail.name, image: detail.image ?? undefined });
      } catch {
        // 실패해도 다른 항목은 계속
      }
    })
  );

  // 원본에 머지
  return items.map((u) => {
    if (u.item_no == null) return u;
    const key = `${u.category}|${u.item_no}`;
    const found = detailMap.get(key);
    if (!found) return u;
    return {
      ...u,
      name: u.name?.trim() ? u.name : (found.name ?? ''),
      image: u.image ?? found.image,
    };
  });
}

/** 내 보관함 아이템 목록 (JWT 필요) — 이름/이미지 자동 보강 */
export async function fetchUserItems(num: number): Promise<UserItemsResponse> {
  const { data } = await api.get<Envelope<UserItemsPayload>>('/shopping/user_item', {
    params: { num, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });

  const normalized = normalizeUserItems((data as any)?.success ?? (data as any));

  // 이름이 비어있으면 상세조회로 보강
  const enrichedList = await enrichUserItems(normalized.itemListEntry);
  return { ...normalized, itemListEntry: enrichedList };
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
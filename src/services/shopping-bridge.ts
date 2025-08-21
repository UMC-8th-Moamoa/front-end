// src/services/shopping-bridge.ts
import instance from "../api/axiosInstance";

export type ShopCategory = "font" | "paper" | "seal";

export type ShoppingAPI = {
  getShopItems: (params: { category: ShopCategory; num?: number }) => Promise<any[]>;
  buyItem: (payload: {
    category: ShopCategory;
    user_id: string;
    item_no: number;
    price: number;
    event?: boolean;
  }) => Promise<any>;
  syncFreeItemsOnce?: (opts: { category: ShopCategory; meUserId: string; limit?: number }) => Promise<void>;
};

/** 존재 시에만 동적 import */
export async function loadShopping(): Promise<Partial<ShoppingAPI>> {
  const candidates = import.meta.glob<true, string, any>("/src/services/shopping.{ts,tsx}");
  const loaders = Object.values(candidates);
  if (loaders.length > 0) {
    const mod = await loaders[0]();
    return (mod || {}) as Partial<ShoppingAPI>;
  }
  return {};
}

// 폴백 내장: shopping.ts 없어도 무료템 자동 수령
export async function syncFreeItemsOnceOrFallback(opts: {
  category: ShopCategory;
  meUserId: string;
  limit?: number;
}) {
  const { category, meUserId, limit = 200 } = opts;

  // 팀 구현 우선
  try {
    const mod = await loadShopping();
    if (mod.syncFreeItemsOnce) {
      return mod.syncFreeItemsOnce({ category, meUserId, limit });
    }
  } catch {
    // 동적 로드 실패는 조용히 폴백으로
  }

  // 폴백: item_list에서 price=0만 구매 시도(1회)
  const gateKey = `free_sync_done_${meUserId}_${category}`;
  if (localStorage.getItem(gateKey) === "1") return;

  try {
    const { data } = await instance.get("/shopping/item_list", {
      params: { category, num: limit },
    });
    const list: any[] = data?.itemListEntry ?? [];
    const freeOnly = list.filter((it) => Number(it.price) === 0);

    for (const it of freeOnly) {
      try {
        await instance.post("/shopping/item_buy", {
          category,
          user_id: meUserId,
          item_no: Number(it.item_no),
          price: 0,
          event: true,
        });
      } catch {
        // 중복/실패 무시(멱등)
      }
    }
  } finally {
    localStorage.setItem(gateKey, "1");
  }
}

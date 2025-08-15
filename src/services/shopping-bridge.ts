// src/services/shopping-bridge.ts
import instance from "../api/axiosInstance";

export type ShopCategory = "font" | "paper" | "envelope";

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

/** 안전한 동적 로드: 파일이 존재할 때만 import 수행 */
export async function loadShopping(): Promise<Partial<ShoppingAPI>> {
  // Vite는 존재하는 파일만 매핑에 넣어줌 → 없으면 빈 객체
  const candidates = import.meta.glob<true, string, any>("/src/services/shopping.{ts,tsx}");
  const loaders = Object.values(candidates);
  if (loaders.length > 0) {
    const mod = await loaders[0](); // 첫 번째 매칭 파일 로드
    return (mod || {}) as Partial<ShoppingAPI>;
  }
  return {};
}

// ★ 폴백 내장: shopping.ts 없어도 무료템 자동 수령
export async function syncFreeItemsOnceOrFallback(opts: {
  category: ShopCategory;
  meUserId: string;
  limit?: number;
}) {
  const { category, meUserId, limit = 200 } = opts;

  // 1) 팀 구현 있으면 그걸 사용
  try {
    const mod = await loadShopping();
    if (mod.syncFreeItemsOnce) {
      return mod.syncFreeItemsOnce({ category, meUserId, limit });
    }
  } catch {
    // 동적 로드 실패는 조용히 폴백으로
  }

  // 2) 폴백: item_list → price=0만 구매 시도
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

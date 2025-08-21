// src/services/freeitems.ts
// 0원(무료) 아이템을 아직 보유하지 않았다면 자동 구매 처리
// - 쇼핑 목록에서 price === 0인 항목 조회
// - 내 보관함에 없으면 buyItem 호출(멱등 가정)

import { fetchItemList, fetchUserItems, buyItem } from "../api/shopping";

export async function ensureFreeItems(
  category: "font" | "paper" | "seal",
  userId: string
) {
  // 전체 쇼핑 목록 조회
  const shop = await fetchItemList(category, 200);
  const freeItems = shop.item.filter((it) => it.price === 0);
  if (freeItems.length === 0) return;

  // 내 보관함 조회
  const mine = await fetchUserItems(200);
  const owned = new Set(mine.itemListEntry.map((it) => it.item_no).filter(Boolean));

  // 미보유 무료 아이템만 구매
  for (const it of freeItems) {
    if (!owned.has(it.item_no)) {
      await buyItem({
        category,
        user_id: userId,
        item_no: it.item_no,
        price: 0,
        event: false,
      });
    }
  }
}

// 0원(무료) 아이템을 아직 보유하지 않았다면 자동으로 구매 처리해주는 유틸
// - 쇼핑 목록에서 price === 0인 항목을 찾고
// - 보관함에 없는 경우 buyItem(가격 0) 호출

import { fetchItemList, fetchUserItems, buyItem } from "../api/shopping";

export async function ensureFreeItems(
  category: "font" | "paper" | "seal",
  userId: string
) {
  // 1) 전체 쇼핑 목록 조회
  const shop = await fetchItemList(category, 200);
  const freeItems = shop.item.filter((it) => it.price === 0);
  if (freeItems.length === 0) return;

  // 2) 현재 보관함 조회
  const mine = await fetchUserItems(200);
  const owned = new Set(mine.itemListEntry.map((it) => it.item_no).filter(Boolean));

  // 3) 보유하지 않은 무료 아이템 자동 구매
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

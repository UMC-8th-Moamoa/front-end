// src/services/letters-user-items.ts
import instance from "../api/axiosInstance";

export type LettersUserItem = {
  holditem_no: number;          // = UserItem.id (서버가 편지 검증에 쓰는 키)
  category: "font" | "paper" | "seal";
  item_no: number;              // = Item.id (원본 아이템 번호)
  name: string;
  price: number;
  image?: string;
  description?: string;
  event?: boolean;
  purchasedAt?: string;
};

export async function fetchLettersUserItems(num = 500): Promise<LettersUserItem[]> {
  const { data } = await instance.get("/letters/user/items", { params: { num } });
  // 스웨거 예시 형태: { userItems: [...] }
  return Array.isArray(data?.userItems) ? data.userItems : [];
}

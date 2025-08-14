// src/services/userItems.ts
import instance from "../api/axiosInstance";


// 단일 아이템 (Swagger 예시 기반)
export type UserItem = {
  holditem_no: number;
  category: string;   // 필요 시 "font" | "paper" | "envelope" 등으로 좁힐 수 있음
  item_no: string;
  user_id: number;
  image: string;
};

// API 래퍼 응답 (프론트 기존 사용 패턴 반영)
export type GetUserItemsResponse = {
  success: boolean;
  num: number;          // 서버가 응답에 num을 포함시키는 경우
  item: UserItem[];
};

/** === API 함수 === */

// 구매한 아이템 조회 (GET /api/user_items?num=)
export async function getUserItems(num = 50): Promise<UserItem[]> {
  const { data } = await instance.get<GetUserItemsResponse>("/api/user_items", {
    params: { num },
  });
  return data.item ?? [];
}

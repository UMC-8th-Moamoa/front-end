import { http } from "../lib/http";

export type UserItem = {
  holditem_id: number;
  category: "font" | "paper" | "envelope";
  name: string;
  image: string;
};

export async function getUserItems(num = 50) {
  const { data } = await http.get<{ success: boolean; num: number; item: UserItem[] }>(
    "/api/user_items",
    { params: { num } }
  );
  return data.item ?? [];
}

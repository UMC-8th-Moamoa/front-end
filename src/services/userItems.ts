// src/services/userItems.ts
import instance from "../api/axiosInstance";

/** 서버 표준 카테고리 (백엔드에서 쓰는 값) */
export type UserItemCategory = "LETTER_PAPER" | "STAMP" | "FONT";

/** 서버 응답 스키마(스웨거 예시 기준) */
export type UserItem = {
  holditem_no: number | null;  // 기본 아이템이면 null일 수 있음
  category: string;
  item_no: string;
  user_id: number | null;      // 기본 아이템이면 null일 수 있음
  image: string;
  name?: string;
  isDefault?: boolean;         // 서버가 주면 구분용(없어도 동작)
};

export type UserItemsPage = {
  content: UserItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

/** 프론트에서 들어오는 다양한 표기 → 서버 표준 카테고리로 정규화 */
export function normalizeCategory(input?: string | null): UserItemCategory | undefined {
  if (!input) return undefined;
  const key = String(input).toUpperCase();

  // 허용 별칭들
  if (["LETTER_PAPER", "PAPER", "LETTER", "LETTERPAPER", "편지지"].includes(key)) return "LETTER_PAPER";
  if (["STAMP", "ENVELOPE", "SEAL", "우표", "봉투"].includes(key)) return "STAMP";
  if (["FONT", "글꼴", "폰트"].includes(key)) return "FONT";

  return undefined;
}

/** 구매(보유) 아이템 목록: GET /api/user-items?category=&page=&size= */
export async function getUserItems(
  category?: UserItemCategory | string,
  page = 1,
  size = 15,
  opts?: { includeDefault?: boolean }        // ★ 4번째 인자 추가
): Promise<UserItemsPage> {
  const normalized = normalizeCategory(category);
  const { data } = await instance.get<UserItemsPage>("/user-items", {
    params: {
      category: normalized,
      page,
      size,
      includeDefault: opts?.includeDefault ?? true,  // ★ 전달(서버가 무시해도 OK)
    },
  });
  return data;
}

/** 카테고리 헬퍼 */
export const isPaper = (cat?: string) => normalizeCategory(cat) === "LETTER_PAPER";
export const isStamp = (cat?: string) => normalizeCategory(cat) === "STAMP";
export const isFont  = (cat?: string) => normalizeCategory(cat) === "FONT";

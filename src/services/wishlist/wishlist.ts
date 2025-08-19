// src/services/wishlist/wishlist.ts
import instance from "../../api/axiosInstance";

/** ---------- API 타입 ---------- */
export type WishlistSort = "created_at" | "price_desc" | "price_asc";
export type WishlistVisibility = "public" | "private";

export type MyWishlistItemRaw = {
  id: number;
  productName: string;
  price: number;
  productImageUrl: string;
  /** 서버 스키마에 없을 수도 있어서 optional */
  visibility?: WishlistVisibility | null;
};

export type MyWishlistsResponse = {
  content: MyWishlistItemRaw[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

/** 목록 조회 */
export async function fetchMyWishlists(params: {
  sort?: WishlistSort;
  visibility?: WishlistVisibility;
  page?: number;
  size?: number;
}) {
  const { data } = await instance.get<MyWishlistsResponse>("/wishlists", {
    params,
  });
  return data;
}

/** ------ (선택) UI 매핑 헬퍼 ------ */
export type WishlistUiItem = {
  id: number;
  title: string;
  price: number;
  priceText: string;
  imageSrc: string;
  isPublic: boolean; // 서버에 없으면 true로 가정
};

export function mapToUi(items: MyWishlistItemRaw[]): WishlistUiItem[] {
  const nf = new Intl.NumberFormat("ko-KR");
  return items.map((i) => ({
    id: i.id,
    title: i.productName,
    price: i.price,
    priceText: `${nf.format(i.price)}원`,
    imageSrc: i.productImageUrl,
    isPublic: (i.visibility ?? "public") === "public",
  }));
}

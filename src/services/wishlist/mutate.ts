// src/services/wishlist/mutate.ts
import instance from "../../api/axiosInstance";

/** PATCH 바디 */
export type UpdateWishlistPayload = Partial<{
  productName: string;
  price: number;
  productImageUrl: string | null;
  isPublic: boolean;
}>;

/** 서버가 돌려줄 수 있는 필드(느슨하게) */
export type WishlistPatched = {
  id: number;
  userId: number;
  productName: string;
  price: number;
  productImageUrl: string | null;
  fundingActive?: boolean;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** 수정(PATCH /wishlists/{id}) */
export async function updateWishlist(id: number, payload: UpdateWishlistPayload) {
  const { data } = await instance.patch<WishlistPatched>(`/wishlists/${id}`, payload);
  return data;
}

/** 삭제(DELETE /wishlists/{id}) */
export async function deleteWishlist(id: number) {
  const { data } = await instance.delete<{ message: string }>(`/wishlists/${id}`);
  return data;
}

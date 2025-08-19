// src/services/wishlist/popularlist.ts
import instance from "../../api/axiosInstance";

/** 네이버 베스트 상품 한 항목 */
export type PopularProduct = {
  productName: string;
  price: number;
  productImageUrl: string;
  url: string;
  mallName: string;
  rank: number;
};

type PopularEnvelope = {
  resultType: "SUCCESS" | "FAIL";
  error: any | null;
  success?: {
    products: PopularProduct[];
    total: number;
    source: string;
    crawledAt: string; // ISO
  };
};

/** 인기 위시리스트(네이버 베스트) 조회 */
export async function getPopularWishlists(limit = 10): Promise<PopularProduct[]> {
  const { data } = await instance.get<PopularEnvelope>("/wishlists/popular", {
    params: { limit },
  });

  if (data.resultType !== "SUCCESS" || !data.success) {
    const reason =
      (data as any)?.error?.reason ||
      (typeof data.error === "string" ? data.error : undefined);
    throw new Error(reason ?? "FAILED_TO_FETCH_POPULAR");
  }

  return data.success.products ?? [];
}

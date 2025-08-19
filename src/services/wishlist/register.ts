// src/services/wishlist/register.ts
import instance from "../../api/axiosInstance";

/** 서버가 돌려주는 단일 위시리스트 아이템 */
export type WishlistServerItem = {
  id: number;
  userId: number;
  productName: string;
  price: number;
  productImageUrl: string | null;
  fundingActive: boolean;
  isPublic: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/** 스웨거에 따라 두 가지 바디 타입 지원 */
export type CreateByUrlBody = {
  insertType: "URL";
  url: string;
  isPublic: boolean;
};

export type CreateByImageBody = {
  insertType: "IMAGE";
  productName: string;
  price: number;
  imageUrl?: string | null;
  isPublic: boolean;
};

/** 스웨거 문서가 엔벨롭/직접객체 혼재할 수 있어 모두 수용 */
type MaybeEnvelope<T> =
  | T
  | {
      resultType: "SUCCESS" | "FAIL";
      success?: T;
      error?: unknown;
    };

/** 원시 등록 호출 (URL/IMAGE 공통) */
export async function createWishlist(
  body: CreateByUrlBody | CreateByImageBody
): Promise<WishlistServerItem> {
  const { data } = await instance.post<MaybeEnvelope<WishlistServerItem>>(
    "/wishlists",
    body
  );

  // 엔벨롭 대응
  const asAny = data as any;
  if (asAny && typeof asAny === "object" && "resultType" in asAny) {
    if (asAny.resultType === "SUCCESS" && asAny.success) return asAny.success;
    throw new Error(
      (asAny?.error as any)?.message || "FAILED_TO_CREATE_WISHLIST"
    );
  }
  return data as WishlistServerItem;
}

/** 편의: 자동 입력(크롤링) */
export function createWishlistByUrl(params: {
  url: string;
  isPublic: boolean;
}) {
  return createWishlist({
    insertType: "URL",
    url: params.url,
    isPublic: params.isPublic,
  });
}

/** 편의: 수동 입력(직접 값) */
export function createWishlistManual(params: {
  productName: string;
  price: number;
  imageUrl?: string | null;
  isPublic: boolean;
}) {
  return createWishlist({
    insertType: "IMAGE",
    productName: params.productName,
    price: Number(params.price ?? 0),
    imageUrl: params.imageUrl ?? null,
    isPublic: params.isPublic,
  });
}


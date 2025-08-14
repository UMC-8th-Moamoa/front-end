// src/services/wishlist/mutate.ts
import instance from "../../api/axiosInstance";

/** ===== 생성(등록) 요청 타입 ===== */
export type InsertType = "URL" | "IMAGE";

/** 자동 입력(네이버 쇼핑 크롤링) */
export interface CreateByUrlPayload {
  insertType: "URL";
  url: string;
  isPublic: boolean; // true=공개, false=비공개
}

/** 수동 입력(직접 입력) */
export interface CreateByManualPayload {
  insertType: "IMAGE";
  productName: string;
  price: number;
  imageUrl?: string | null;
  isPublic: boolean;
}

export type CreateWishlistPayload = CreateByUrlPayload | CreateByManualPayload;

/** ===== 서버 응답(공통) ===== */
export interface CreatedWishlistResponseRaw {
  id: number;
  userId: number;
  productName: string;
  price: number;
  productImageUrl: string | null;
  fundingActive: boolean;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatedWishlistWrapped = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown;
  success: CreatedWishlistResponseRaw | null;
};

/** ===== UI 표준 타입 ===== */
export interface WishlistUiItem {
  id: number;
  title: string;
  imageSrc: string;
  priceText: string;
  price: number;
  openOption: "locked" | "unlocked";
}

/** DTO → UI 매핑 */
function toUi(raw: CreatedWishlistResponseRaw): WishlistUiItem {
  const imageSrc = raw.productImageUrl ?? "/assets/gift_sample.svg";
  const priceNumber = Number(raw.price ?? 0);
  return {
    id: raw.id,
    title: raw.productName,
    imageSrc,
    price: priceNumber,
    priceText: `${priceNumber.toLocaleString()}원`,
    openOption: raw.isPublic ? "unlocked" : "locked",
  };
}

/** 래퍼/비래퍼 모두 대응해서 raw 뽑기 */
function pickRaw(data: any): CreatedWishlistResponseRaw | null {
  const r: CreatedWishlistResponseRaw | null =
    (data as CreatedWishlistWrapped)?.success ??
    (data && typeof data === "object" && "id" in data
      ? (data as CreatedWishlistResponseRaw)
      : null);
  return r;
}

/** ===== 생성(등록) ===== */
export async function createWishlist(
  payload: CreateWishlistPayload
): Promise<WishlistUiItem> {
  const { data } = await instance.post("/wishlists", payload);
  const raw = pickRaw(data);

  if (raw) return toUi(raw);

  // 생성객체를 안 돌려줄 때 낙관적 값 리턴
  if (payload.insertType === "URL") {
    return {
      id: Date.now(),
      title: payload.url,
      imageSrc: "/assets/gift_sample.svg",
      price: 0,
      priceText: "0원",
      openOption: payload.isPublic ? "unlocked" : "locked",
    };
  } else {
    const price = Number(payload.price ?? 0);
    return {
      id: Date.now(),
      title: payload.productName,
      imageSrc: payload.imageUrl ?? "/assets/gift_sample.svg",
      price,
      priceText: `${price.toLocaleString()}원`,
      openOption: payload.isPublic ? "unlocked" : "locked",
    };
  }
}

/** 편의: 자동 입력 */
export function createWishlistByUrl(url: string, isPublic: boolean) {
  return createWishlist({ insertType: "URL", url, isPublic });
}

/** 편의: 수동 입력 */
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

/** ===== 수정(PATCH) =====
 * Swagger 예시 Body:
 * { "productName": "string", "price": 1000000, "productImageUrl": "string", "isPublic": true }
 */
export interface UpdateWishlistPayload {
  productName?: string;
  price?: number;
  productImageUrl?: string | null; // 서버 스키마 명칭을 그대로 사용
  isPublic?: boolean;
}

export async function updateWishlist(
  id: number,
  patch: UpdateWishlistPayload
): Promise<WishlistUiItem> {
  const { data } = await instance.patch(`/wishlists/${id}`, patch);
  const raw = pickRaw(data) ?? (data as any);
  return toUi(raw);
}

/** ===== 삭제(DELETE) ===== */
export async function deleteWishlist(id: number): Promise<void> {
  await instance.delete(`/wishlists/${id}`);
}

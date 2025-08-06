export interface PopularWishlistItem {
    id: number;
    productName: string;
    productImageUrl: string;
    price: number;
    popularityScore: number;
    wishlistCount: number;
    rank: number;
  }
  
  export interface PopularWishlistResponse {
    resultType: "SUCCESS" | "FAIL";
    error: string | null;
    success?: {
      products: PopularWishlistItem[]; // ← popularWishlists → products로 변경
      total: number;                   // ← total 필드 추가
      metadata?: {
        ageGroup: string;
        updatedAt: string;
      };
    };
  }
  
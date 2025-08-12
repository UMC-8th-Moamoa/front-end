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
      products: PopularWishlistItem[];              
      metadata?: {
        ageGroup: string;
        updatedAt: string;
      };
    };
  }
  
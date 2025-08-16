// src/components/HomePage/List/Popular/PopularList.tsx
import { useEffect, useState } from "react";
import PopularItem from "./PopularItem";
import type { PopularWishlistItem, PopularWishlistResponse } from "../../../../services/wishlist/popularwishlist";
import instance from "../../../../api/axiosInstance";
import { createWishlistManual } from "../../../../services/wishlist/mutate";

interface PopularListProps {
  /** 등록 성공 후 HomePage에서 배너 띄우도록 호출 */
  onAdded?: () => void;
}

const PopularList = ({ onAdded }: PopularListProps) => {
  const [items, setItems] = useState<PopularWishlistItem[]>([]);

  useEffect(() => {
    const fetchPopularWishlists = async () => {
      try {
        const { data } = await instance.get<PopularWishlistResponse>("/wishlists/popular");
        if (data.resultType === "SUCCESS" && Array.isArray(data.success?.products)) {
          setItems(data.success.products);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("❌ 인기 위시리스트 API 에러:", err);
        setItems([]);
      }
    };
    fetchPopularWishlists();
  }, []);

  // 아이템별 "확인" 클릭 시: 등록 → 성공 시 onAdded 호출
  const handleConfirmAdd = (item: PopularWishlistItem) => async () => {
    try {
      await createWishlistManual({
        productName: item.productName,
        price: Number(item.price ?? 0),
        imageUrl: item.productImageUrl,
        isPublic: true,
      });
      onAdded?.(); // ✅ 부모(HomePage)에게 성공 알림
    } catch (e: any) {
      console.error("[인기 아이템 추가 실패]", e?.response?.data || e);
      alert(e?.response?.data?.message || "위시리스트 추가에 실패했어요.");
    }
  };

  return (
    <section className="w-[393px] mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-2 mb-[16px]">
        TOP10 인기 위시리스트
      </h2>
      <div className="w-[350px] flex overflow-x-auto mx-auto scrollbar-hide">
        {items.length > 0 ? (
          items.map((item) => (
            <PopularItem
              key={item.id}
              imageUrl={item.productImageUrl}
              title={item.productName}
              onConfirm={handleConfirmAdd(item)}  
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default PopularList;

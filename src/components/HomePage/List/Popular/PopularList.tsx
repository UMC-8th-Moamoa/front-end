// src/components/HomePage/List/Popular/PopularList.tsx
import { useEffect, useState } from "react";
import PopularItem from "./PopularItem";
import { getPopularWishlists, type PopularProduct } from "../../../../services/wishlist/popularwishlist";
import { createWishlistManual } from "../../../../services/wishlist/register";

interface PopularListProps {
  /** 등록 성공 후 HomePage에서 배너 띄우도록 호출 */
  onAdded?: () => void;
}

const PopularList = ({ onAdded }: PopularListProps) => {
  const [items, setItems] = useState<PopularProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const products = await getPopularWishlists(10);
        setItems(products);
      } catch (err) {
        console.error("❌ 인기 위시리스트 API 에러:", err);
        setItems([]);
      }
    })();
  }, []);

  // 아이템별 "확인" 클릭 시: 등록 → 성공 시 onAdded 호출
  const handleConfirmAdd = (item: PopularProduct) => async () => {
    try {
      await createWishlistManual({
        productName: item.productName,
        price: Number(item.price ?? 0),
        imageUrl: item.productImageUrl,
        isPublic: true,
      });
      onAdded?.();
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
              key={`${item.rank}-${item.productName}`}  
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

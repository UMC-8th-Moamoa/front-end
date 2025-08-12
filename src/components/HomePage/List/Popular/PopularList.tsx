import { useEffect, useState } from "react";
import PopularItem from "./PopularItem";
import type { PopularWishlistItem, PopularWishlistResponse } from "../../../../services/popularwishlist";
import instance from "../../../../api/axiosInstance";




export interface PopularListProps {
  onConfirm: () => Promise<void>;
}

const PopularList = ({ onConfirm }: PopularListProps) => {
  const [items, setItems] = useState<PopularWishlistItem[]>([]);

  useEffect(() => {
    const fetchPopularWishlists = async () => {
      try {
        const { data } = await instance.get<PopularWishlistResponse>("/wishlists/popular");
        if (data.resultType === "SUCCESS" && Array.isArray(data.success?.products)) {
          setItems(data.success.products);
        } else {
          console.warn("⚠️ 인기 위시리스트 데이터 없음");
          setItems([]);
        }
      } catch (err) {
        console.error("❌ 인기 위시리스트 API 호출 에러:", err);
        setItems([]);
      }
    };
    fetchPopularWishlists();
  }, []);

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
              onConfirm={onConfirm}
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

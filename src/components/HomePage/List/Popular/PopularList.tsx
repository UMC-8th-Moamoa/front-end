import { useEffect, useState } from "react";
import PopularItem from "./PopularItem";
import type { PopularWishlistItem, PopularWishlistResponse } from "../../../../types/wishlist";

export interface PopularListProps {
  onConfirm: () => Promise<void>;
}

// dev: Vite 프록시 사용(/api), prod: 환경변수 or 도메인 직통
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL ?? "https://www.moamoas.com/api");

const PopularList = ({ onConfirm }: PopularListProps) => {
  const [items, setItems] = useState<PopularWishlistItem[]>([]);

  useEffect(() => {
    const fetchPopularWishlists = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ??
          import.meta.env.VITE_TEMP_ACCESS_TOKEN;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/wishlists/popular`, {
          method: "GET",
          headers,
        });

        if (!res.ok) {
          console.error("❌ API 응답 실패:", res.status, res.statusText);
          setItems([]);
          return;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          console.error("❌ JSON 아님:", ct, text.slice(0, 120));
          setItems([]);
          return;
        }

        const data: PopularWishlistResponse = await res.json();
        console.log("📌 API 응답 데이터:", data);

        if (data.resultType === "SUCCESS" && Array.isArray(data.success?.products)) {
          setItems(data.success.products);
        } else {
          console.warn("⚠️ 인기 위시리스트 데이터 없음");
          setItems([]);
        }
      } catch (error) {
        console.error("❌ API 호출 에러:", error);
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

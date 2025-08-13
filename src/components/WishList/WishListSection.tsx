// src/components/WishList/WishListSection.tsx
import { useEffect, useState } from "react";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";
import {
  getMyWishlists,
  mapSortLabelToApi,
  type WishlistUiItem,
} from "../../services/wishlist";

const WishListSection = () => {
  const [sort, setSort] = useState("등록순"); // "등록순" | "가격↑" | "가격↓" (UI 라벨)
  const [list, setList] = useState<WishlistUiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const sortApi = mapSortLabelToApi(sort);
        const page = await getMyWishlists({ page: 1, size: 10, sort: sortApi });
        setList(page.items);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [sort]);

  if (loading) return <div className="w-[393px] px-4 py-6">불러오는 중…</div>;
  if (err) return <div className="w-[393px] px-4 py-6 text-red-500">{err}</div>;

  return (
    <div className="w-[393px] px-4 py-6 space-y-2">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#6282E1] px-2">
          나의 위시리스트
        </h2>
        <SortDropdown selected={sort} onChange={setSort} />
      </div>

      {/* 리스트/빈 상태 */}
      {list.length === 0 ? (
        <div className="mt-6 text-sm text-gray-500 px-2">위시리스트가 없어요</div>
      ) : (
        <div className="w-full mx-auto flex flex-col gap-3">
          {list.map((item) => (
            <WishlistItem
              key={item.id}
              imageSrc={item.imageSrc}
              title={item.title}
              price={item.priceText}
              openOption={item.openOption} // 'locked' | 'unlocked'
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListSection;

// src/components/WishList/WishListSection.tsx
import { useEffect, useRef, useState } from "react";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";
import ToastBanner from "./ToastBanner";

import {
  getMyWishlists,
  mapSortLabelToApi,
  type WishlistUiItem,
  type WishlistVisibility, // "public" | "private"
} from "../../services/wishlist/list";

const WishListSection = () => {
  // 드롭다운 라벨: "등록순" | "높은 가격순" | "낮은 가격순" | "공개" | "비공개"
  const [sortLabel, setSortLabel] = useState("등록순");
  const [list, setList] = useState<WishlistUiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastShow(false), 3000);
  };

  /** 라벨이 공개/비공개 필터인지 판별 */
  const labelToVisibility = (label: string): WishlistVisibility | undefined => {
    if (label === "공개") return "public";
    if (label === "비공개") return "private";
    return undefined;
  };

  /** 라벨이 정렬(등록/가격)인지 판별 */
  const isSortLabel = (label: string) =>
    label === "등록순" || label === "높은 가격순" || label === "낮은 가격순";

  const load = async (label: string) => {
    try {
      setLoading(true);
      setErr(null);

      // 정렬: 등록/가격 / 필터: 공개/비공개
      const visibility = labelToVisibility(label);
      const sortApi = isSortLabel(label) ? mapSortLabelToApi(label) : "created_at";

      const page = await getMyWishlists({
        page: 1,
        size: 10,
        sort: sortApi,
        visibility, // 공개/비공개 선택 시에만 값이 들어감
      });

      setList(page.items);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(sortLabel);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortLabel]);

  const handleUpdated = (next: WishlistUiItem) => {
    setList((prev) => prev.map((x) => (x.id === next.id ? next : x)));
  };

  const handleDeleted = (id: number) => {
    setList((prev) => prev.filter((x) => x.id !== id));
    showToast("위시리스트가 삭제되었습니다");
  };

  if (loading) return <div className="w-[393px] px-4 py-6">불러오는 중…</div>;
  if (err) return <div className="w-[393px] px-4 py-6 text-red-500">{err}</div>;

  return (
    <div className="w-[393px] px-4 py-6 space-y-2 relative">
      <ToastBanner show={toastShow} message={toastMsg} />

      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#6282E1] px-2">나의 위시리스트</h2>
        <SortDropdown selected={sortLabel} onChange={setSortLabel} />
      </div>

      {list.length === 0 ? (
        <div className="mt-6 text-sm text-gray-500 px-2">위시리스트가 없어요</div>
      ) : (
        <div className="w-full mx-auto flex flex-col gap-3">
          {list.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListSection;

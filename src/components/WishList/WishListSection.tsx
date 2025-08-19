// src/components/WishList/WishListSection.tsx
import { useEffect, useRef, useState } from "react";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";
import ToastBanner from "./ToastBanner";

// ✅ API 헬퍼
import {
  fetchMyWishlists,
  mapToUi,
  type WishlistSort,
  type WishlistVisibility,
} from "../../services/wishlist/wishlist";

/** UI 전용 타입 (기존 유지) */
export type WishlistUiItem = {
  id: number;
  title: string;
  price: number;
  priceText: string;
  imageSrc: string;
  isPublic: boolean;
};

/** 필요하면 여기에 더미 데이터를 넣어서 UI 확인 가능 (기존 유지) */
const INITIAL_ITEMS: WishlistUiItem[] = [
  // {
  //   id: 1,
  //   title: "선물 상자 A",
  //   price: 12000,
  //   priceText: "12,000원",
  //   imageSrc: "/assets/WhitePhoto.svg",
  //   isPublic: true,
  // },
];

const WishListSection = () => {
  // 드롭다운 라벨: "등록순" | "높은 가격순" | "낮은 가격순" | "공개" | "비공개"
  const [sortLabel, setSortLabel] = useState("등록순");

  // 전체 원본 목록(등록순은 이 배열의 현재 순서를 기준으로 함)
  const [allItems, setAllItems] = useState<WishlistUiItem[]>(INITIAL_ITEMS);

  // 화면에 보여줄 목록
  const [list, setList] = useState<WishlistUiItem[]>(INITIAL_ITEMS);

  // 로딩/에러 플래그 (기존 유지 — UI에서는 사용하지 않음)
  const [loading] = useState(false);
  const [err] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  /** 🔄 서버 호출: 정렬/필터 라벨에 따라 목록 불러오기 */
  useEffect(() => {
    let aborted = false;

    const load = async () => {
      // UI 라벨 -> 서버 파라미터 매핑
      const sortLabelToSort: Record<string, WishlistSort> = {
        "등록순": "created_at",
        "높은 가격순": "price_desc",
        "낮은 가격순": "price_asc",
      };
      const sort: WishlistSort = sortLabelToSort[sortLabel] ?? "created_at";

      const visibilityLabelToParam: Record<string, WishlistVisibility> = {
        "공개": "public",
        "비공개": "private",
      };
      const visibility: WishlistVisibility | undefined =
        visibilityLabelToParam[sortLabel];

      try {
        const res = await fetchMyWishlists({
          sort,
          visibility,
          page: 1,
          size: 50, // 한 번에 넉넉히
        });
        if (aborted) return;

        const ui = mapToUi(res.content);
        setAllItems(ui);
        setList(ui);
      } catch (e: any) {
        if (aborted) return;
        console.error("[위시리스트 불러오기 실패]", e?.response?.data || e);
        setAllItems([]);
        setList([]);
      }
    };

    load();
    return () => {
      aborted = true;
    };
  }, [sortLabel]);

  if (loading) return <div className="w-[393px] px-4 py-6">불러오는 중…</div>;
  if (err) return <div className="w-[393px] px-4 py-6 text-red-500">{err}</div>;

  return (
    <div className="w-[393px] px-4 py-6 space-y-2 relative">
      <ToastBanner show={toastShow} message={toastMsg} />

      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#6282E1] px-2">
          나의 위시리스트
        </h2>
        <SortDropdown selected={sortLabel} onChange={setSortLabel} />
      </div>

      {list.length === 0 ? (
        <div className="mt-6 text-sm text-gray-500 px-2">
          위시리스트가 없어요
        </div>
      ) : (
        <div className="w-full mx-auto flex flex-col gap-3">
          {list.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              // 로컬 토글/삭제 — 서버 연동 전 UI만 반영
              onUpdated={(next) =>
                setAllItems((prev) =>
                  prev.map((x) => (x.id === next.id ? next : x))
                )
              }
              onDeleted={(id) => {
                setAllItems((prev) => prev.filter((x) => x.id !== id));
                setList((prev) => prev.filter((x) => x.id !== id));
                showToast("위시리스트가 삭제되었습니다");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListSection;

import { useEffect, useRef, useState } from "react";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";
import ToastBanner from "./ToastBanner";

/** UI 전용 타입 (서비스 의존 제거) */
export type WishlistUiItem = {
  id: number;
  title: string;
  price: number;
  priceText: string;
  imageSrc: string;
  isPublic: boolean;
};

/** 필요하면 여기에 더미 데이터를 넣어서 UI 확인 가능 */
const INITIAL_ITEMS: WishlistUiItem[] = [
  // 예시) 주석 해제해서 써도 됨
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

  // 로딩/에러는 UI 유지용 플래그 (네트워크 없음)
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

  /** 정렬/필터 계산 (클라이언트 전용) */
  useEffect(() => {
    let items = [...allItems];

    // 공개/비공개 필터
    if (sortLabel === "공개") {
      items = items.filter((it) => it.isPublic === true);
    } else if (sortLabel === "비공개") {
      items = items.filter((it) => it.isPublic === false);
    }

    // 가격 정렬
    if (sortLabel === "높은 가격순") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortLabel === "낮은 가격순") {
      items.sort((a, b) => a.price - b.price);
    }
    // "등록순"은 allItems의 현재 순서 유지

    setList(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortLabel, allItems]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  /** 아이템 토글/수정 시 allItems 업데이트 → 화면 목록도 자동 반영 */
  const handleUpdated = (next: WishlistUiItem) => {
    setAllItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
  };

  /** 삭제 시 allItems에서 제거 */
  const handleDeleted = (id: number) => {
    setAllItems((prev) => prev.filter((x) => x.id !== id));
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

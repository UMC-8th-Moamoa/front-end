import ItemCard from "./ItemCard";
import React, { useEffect, useState } from "react";
import { getUserItems, type UserItem, isFont } from "../../services/userItems";
import { syncFreeItemsOnceOrFallback } from "../../services/shopping-bridge";
import { getMyUserId } from "../../services/mypage";                    // 사용

type Props = {
  selectedFontId?: number | null;                   // 선택된 폰트 아이템 ID (보관함 holditem_no 기준)
  selectedFont?: string | null;                     // UI 표시용 폰트명
  onSelect?: (data: { id: number; family?: string }) => void; // id + family 함께 전달
};

// 기본아이템은 holditem_no가 null일 수 있으므로, 안정적인 선택/키 생성을 위한 유틸
function stableIdOf(it: UserItem): number {
  // 구매 아이템: 양수 id
  if (typeof it.holditem_no === "number" && !Number.isNaN(it.holditem_no)) {
    return it.holditem_no;
  }
  // 기본 아이템: 음수 id로 합성 (충돌 방지)
  // item_no가 문자열이므로 간단한 해시 대체: 숫자만 추출 or 길이 사용
  const n = Number(String(it.item_no).replace(/\D/g, "").slice(-6)) || String(it.item_no).length;
  return -Math.abs(n);
}

export default function FontItemList({ selectedFontId, selectedFont, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        // 1) shopping.ts가 있으면 무료(0원) 폰트를 자동 수령 (없으면 조용히 스킵)
       // 무료(0원) 폰트 자동 수령 (shopping.ts 없어도 폴백으로 동작)
       const meUserId = getMyUserId();
       await syncFreeItemsOnceOrFallback({ category: "font", meUserId, limit: 200 });

        // 2) 보관함 불러오기 (기본아이템 포함)
        const page = await getUserItems("FONT", 1, 50, { includeDefault: true });
        setItems((page.content || []).filter((x) => isFont(x.category)));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex justify-center pt-2 max-h-[320px] overflow-y-auto">
      {/* 오타 수정: w/full -> w-full */}
      <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading label="로딩중" />)
          : items.map((it) => {
              const label = it.name ?? it.item_no;
              const sid = stableIdOf(it); // 안정 id(구매: 양수, 기본: 음수)
              const isSelected =
                (selectedFontId != null && selectedFontId === sid) ||
                (selectedFont != null && selectedFont === label);

              return (
                <button
                  key={(sid > 0 ? "o" : "d") + "-" + sid} // 구매/기본을 구분한 키
                  onClick={() => onSelect?.({ id: sid, family: label })}
                  className={`rounded-[12px] overflow-hidden border ${
                    isSelected ? "border-[#6282E1]" : "border-transparent"
                  }`}
                >
                  <ItemCard imageSrc={it.image} label={label} />
                </button>
              );
            })}
      </div>
    </div>
  );
}

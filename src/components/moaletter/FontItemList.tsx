import ItemCard from "./ItemCard";
import React, { useEffect, useState } from "react";
import { fetchUserItems, type UserItem } from "../../api/shopping";
import { ensureFreeItems } from "../../services/freeitems";
import { getMyUserId } from "../../services/mypage";

type Props = {
  selectedFontId?: number | null;                     // 부모가 보관하는 폰트 안정 ID(holditem_id)
  selectedFont?: string | null;                       // 부모가 보관하는 폰트명(이름 매칭)
  onSelect?: (data: { id: number; family?: string }) => void;
};

export default function FontItemList({ selectedFontId, selectedFont, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        // 1) 무료 폰트 자동 지급: 로그인 유저만 시도
        const meUserId = getMyUserId();
        if (meUserId) {
          // ensureFreeItems는 0원만 buyItem 호출. 이미 보유하면 skip.
          await ensureFreeItems("font", meUserId);
        }

        // 2) 보관함 로드(폰트만 필터)
        const res = await fetchUserItems(200);
        const fonts = res.itemListEntry.filter((x) => x.category === "font");

        setItems(fonts);

        // 3) 초기 자동 선택: 부모가 아직 선택 안 했으면 첫 번째를 선택해 동기화
        if ((selectedFontId == null && !selectedFont) && fonts.length > 0) {
          const first = fonts[0];
          onSelect?.({ id: first.holditem_id, family: first.name || String(first.item_no ?? "") });
        }
      } catch (e: any) {
        console.error("[FontItemList] load error:", e);
        setLoadError("폰트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
    // 부모 선택값이 바뀌었다고 목록을 재호출할 필요는 없으므로 deps는 비움
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center pt-2 max-h-[320px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading label="로딩중" />)
        ) : loadError ? (
          <div className="col-span-2 text-center text-[14px] text-[#B7B7B7] py-6">
            {loadError}
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-2 text-center text-[14px] text-[#B7B7B7] py-6">
            보관함에 폰트가 없습니다.
          </div>
        ) : (
          items.map((it) => {
            // 라벨은 name 우선, 없으면 item_no로 대체
            const label = it.name || String(it.item_no ?? "");

            // 선택 기준:
            // 1) id가 넘어오면 id 우선
            // 2) 아니면 family(이름)으로도 선택 유지
            const isSelected =
              (selectedFontId != null && selectedFontId === it.holditem_id) ||
              (!!selectedFont && selectedFont === label);

            return (
              <button
                key={it.holditem_id}
                onClick={() => onSelect?.({ id: it.holditem_id, family: label })}
                className={`rounded-[12px] overflow-hidden border ${
                  isSelected ? "border-[#6282E1]" : "border-transparent"
                }`}
                aria-pressed={isSelected}
                aria-label={`폰트 선택: ${label}`}
              >
                <ItemCard imageSrc={it.image} label={label} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

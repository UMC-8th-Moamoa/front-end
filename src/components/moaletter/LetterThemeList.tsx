import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { getUserItems, type UserItem, isPaper } from "../../services/userItems";

type Props = {
  selectedId?: number | null;
  // 부모가 배경도 쓰게 id + image 함께 올려줌
  onSelect?: (data: { id: number; image?: string }) => void;
};

// 구매/기본 아이템 모두 커버하는 안정 ID
function stableIdOf(it: UserItem): number {
  if (typeof it.holditem_no === "number" && !Number.isNaN(it.holditem_no)) return it.holditem_no; // 구매: 양수
  const n = Number(String(it.item_no).replace(/\D/g, "").slice(-6)) || String(it.item_no).length;
  return -Math.abs(n); // 기본: 음수 합성
}

export default function LetterThemeList({ selectedId, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]); // paper만

  useEffect(() => {
    (async () => {
      try {
        const page = await getUserItems("LETTER_PAPER", 1, 50, { includeDefault: true });
        const onlyPaper = (page.content || []).filter((x) => isPaper(x.category));
        setItems(onlyPaper);

        // ✅ 초기 진입 시 기본(또는 첫 번째) 자동 선택
        if (selectedId == null && onlyPaper.length > 0) {
          const def = onlyPaper.find((x: any) => x.isDefault) ?? onlyPaper[0];
          const sid = stableIdOf(def);
          onSelect?.({ id: sid, image: def.image });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedId, onSelect]);

  return (
    <div className="flex justify-center pt-2 max-h-[320px]">
      <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading label="로딩중" />)
          : items.map((it) => {
              const sid = stableIdOf(it);
              return (
                <button
                  key={(sid > 0 ? "o" : "d") + "-" + sid}
                  onClick={() => onSelect?.({ id: sid, image: it.image })}
                  className={`rounded-[12px] overflow-hidden border ${
                    selectedId === sid ? "border-[#6282E1]" : "border-transparent"
                  }`}
                >
                  <ItemCard imageSrc={it.image} label={it.name ?? it.item_no} />
                </button>
              );
            })}
      </div>
    </div>
  );
}

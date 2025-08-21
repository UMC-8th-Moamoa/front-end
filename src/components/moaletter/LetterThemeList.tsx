// src/components/moaletter/LetterThemeList.tsx
// 역할: 편지지 선택(배경 이미지)
// 변경 요약:
// 1) 데이터 소스: fetchUserItems 로 통일 (신규 /letters/user/items 우선)
// 2) 0원 편지지 자동 지급: ensureFreeItems("paper", meUserId) — meUserId 가드
// 3) 안정 ID: holditem_id 그대로 사용
// 4) 초기 진입 시 기본(첫 번째) 자동 선택 + 부모에 id/image 전달

import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { fetchUserItems, type UserItem } from "../../api/shopping";
import { ensureFreeItems } from "../../services/freeitems";
import { getMyUserId } from "../../services/mypage";

type Props = {
  selectedId?: number | null;
  onSelect?: (data: { id: number; image?: string }) => void;
};

export default function LetterThemeList({ selectedId, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        // 1) 무료 편지지 자동 지급 — 로그인 유저일 때만 호출 (TS: string | null → 가드)
        const meUserId = getMyUserId();
        if (meUserId) {
          await ensureFreeItems("paper", meUserId);
        }

        // 2) 보관함 로드(편지지만 필터)
        const res = await fetchUserItems(200);
        const onlyPaper = res.itemListEntry.filter((x) => x.category === "paper");
        setItems(onlyPaper);

        // 3) 초기 자동 선택 (부모에도 통지)
        if (selectedId == null && onlyPaper.length > 0) {
          const first = onlyPaper[0];
          onSelect?.({ id: first.holditem_id, image: first.image });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedId, onSelect]);

  return (
    <div className="flex justify-center pt-2 max-h-[320px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ItemCard key={i} isLoading label="로딩중" />
            ))
          : items.map((it) => (
              <button
                key={it.holditem_id}
                onClick={() => onSelect?.({ id: it.holditem_id, image: it.image })}
                className={`rounded-[12px] overflow-hidden border ${
                  selectedId === it.holditem_id ? "border-[#6282E1]" : "border-transparent"
                }`}
              >
                <ItemCard imageSrc={it.image} label={it.name || String(it.item_no ?? "")} />
              </button>
            ))}
      </div>
    </div>
  );
}

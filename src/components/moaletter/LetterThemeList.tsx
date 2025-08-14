import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { getUserItems, type UserItem } from "../../services/userItems";

type Props = {
  selectedId?: number | null;
  onSelect?: (id: number) => void;
};

export default function LetterThemeList({ selectedId, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]); // paper만

  useEffect(() => {
    (async () => {
      try {
        const all = await getUserItems(50);
        setItems(all.filter((x) => x.category === "paper"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex justify-center pt-2 max-h-[320px]">
      <div className="grid grid-cols-2 gap-[10px] w/full max-w-[350px]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ItemCard key={i} isLoading={true} label="로딩중" />
            ))
          : items.map((it) => (
              <button
                key={it.holditem_id}
                onClick={() => onSelect?.(it.holditem_id)}
                className={`rounded-[12px] overflow-hidden border ${
                  selectedId === it.holditem_id ? "border-[#6282E1]" : "border-transparent"
                }`}
              >
                <ItemCard imageSrc={it.image} label={it.name} />
              </button>
            ))}
      </div>
    </div>
  );
}

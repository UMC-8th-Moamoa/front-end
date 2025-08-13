import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { getUserItems, type UserItem } from "../../services/userItems";

type Props = {
  selectedFont?: string | null;
  onSelect?: (fontFamily: string) => void;
};

export default function FontItemList({ selectedFont, onSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<UserItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const all = await getUserItems(50);
        setItems(all.filter((x) => x.category === "font"));
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
                onClick={() => onSelect?.(it.name)}
                className={`rounded-[12px] overflow-hidden border ${
                  selectedFont === it.name ? "border-[#6282E1]" : "border-transparent"
                }`}
              >
                <ItemCard imageSrc={it.image} label={it.name} />
              </button>
            ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";

export default function FontItemList() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    // 1초 후 로딩 해제 (가짜 데이터)
    setTimeout(() => {
      setItems(["산돌체", "고딕체", "심플체", "손글씨", "감성체", "동글체"]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex justify-center px-4 pt-2 max-h-[320px]">
      <div className="grid grid-cols-2 gap-x-[8px] gap-y-[20px] w-full max-w-[350px]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ItemCard key={i} isLoading={true} label="로딩중" />
            ))
          : items.map((name, i) => (
              <ItemCard key={i} imageSrc="" label={name} />
            ))}
      </div>
    </div>
  );
}

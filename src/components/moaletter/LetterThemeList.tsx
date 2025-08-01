import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

export default function LetterThemeList() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]); // 예시: item 이름 리스트

  useEffect(() => {
    setTimeout(() => {
      setItems(["봄편지지", "하늘편지지", "분홍편지지", "초록편지지", "겨울편지지", "보라편지지"]);
      setIsLoading(false);
    }, 1000); // 1초 뒤 로딩 해제 (가짜 로딩)
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

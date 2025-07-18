import ItemCard from "./ItemCard";

export default function LetterThemeList() {
  return (
    <div className="flex justify-center px-4 pt-2 max-h-[320px]">
      <div className="grid grid-cols-2 gap-x-[8px] gap-y-[20px] w-full max-w-[350px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <ItemCard key={i} imageSrc="" label="아이템명" />
        ))}
      </div>
    </div>
  );
}

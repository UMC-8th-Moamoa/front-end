import PickGiftItem from "./PickGiftItem";
import PickGiftAddButton from "./PickGiftAddButton";

interface PickGiftListProps {
  items: any[];
  checkedItems: number[];
  onChange: (id: number) => void;
}

export const PickGiftList = ({ items, checkedItems, onChange }: PickGiftListProps) => {
  return (
    <div className="w-[350px] max-h-[430px] overflow-y-auto flex flex-col gap-2 px-1">
      {items.map((item) => (
        <PickGiftItem
          key={item.id}
          id={item.id}
          imageSrc={item.imageSrc}
          title={item.title}
          price={item.price}
          checked={checkedItems.includes(item.id)}
          onChange={onChange}
        />
      ))}

      {/* 아래 여백 확보 */}
      <div className="h-4" />

      {/* 위시리스트 추가 버튼 */}
      <PickGiftAddButton />
    </div>
  );
};

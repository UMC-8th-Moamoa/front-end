// components/HomePage/PickGift/PickGiftList.tsx
import PickGiftItem from "./PickGiftItem";
import PickGiftAddButton from "./PickGiftAddButton";
import { type WishlistUiItem } from "../../../services/user/mybirthday";

interface PickGiftListProps {
  items: WishlistUiItem[];
  checkedItems: number[];
  onChange: (id: number) => void;
}

export const PickGiftList = ({ items, checkedItems, onChange }: PickGiftListProps) => {
  return (
    <div className="w-[350px] max-h-[450px] overflow-y-auto flex flex-col gap-2 px-1">
      {items.map((item) => (
        <PickGiftItem
          key={item.id}
          id={item.id}
          imageSrc={item.imageSrc}
          title={item.title}
          price={item.price}            // ✅ number로 전달
          checked={checkedItems.includes(item.id)}
          onChange={onChange}
        />
      ))}

      <div className="h-4" />
      <PickGiftAddButton />
    </div>
  );
};

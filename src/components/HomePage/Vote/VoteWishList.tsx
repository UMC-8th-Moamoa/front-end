import VoteWishItem from "./VoteWishItem";
import { type VoteUiItem } from "../../../services/wishlist/vote";

interface VoteWishListProps {
  items: VoteUiItem[];
  selectedId: number | null;
  setSelectedId: (id: number | null) => void; // 선택 취소 허용
  loading?: boolean;
}

const VoteWishList = ({
  items,
  selectedId,
  setSelectedId,
  loading = false,
}: VoteWishListProps) => {
  if (loading && items.length === 0) {
    return (
      <div className="w-[350px] h-[580px] flex items-center justify-center">
        불러오는 중…
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="w-[350px] h-[580px] flex items-center justify-center">
        투표할 항목이 없어요
      </div>
    );
  }

  return (
    <div className="w-[350px] h-[580px] overflow-y-auto overflow-x-hidden flex flex-col gap-2">
      {items.map((item) => (
        <VoteWishItem
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          price={item.price}
          selected={selectedId === item.id}
          onSelect={() =>
            setSelectedId(selectedId === item.id ? null : item.id)
          }
        />
      ))}
    </div>
  );
};

export default VoteWishList;

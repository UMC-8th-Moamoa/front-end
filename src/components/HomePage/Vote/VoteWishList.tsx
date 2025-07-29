
import { recipientDummy } from "../Participation/RecipientDummy";
import VoteWishItem from "./VoteWishItem";

interface VoteWishListProps {
  selectedId: number | null;
  setSelectedId: (id: number) => void;
}

const VoteWishList = ({ selectedId, setSelectedId }: VoteWishListProps) => {
  return (
    <div className="w-[350px] h-[580px] overflow-y-auto overflow-x-hidden flex flex-col gap-2">
      {recipientDummy.wishList.map((item, index) => (
        <VoteWishItem
          key={index}
          imageUrl={item.imageUrl}
          title={item.title}
          price={item.price}
          selected={selectedId === index}
          onSelect={() => setSelectedId(index)} 
        />
      ))}
    </div>
  );
};

export default VoteWishList;

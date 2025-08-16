import { useNavigate } from "react-router-dom";
import MemberWishItem from "./MemberWishItem";

type WishlistUi = { id: number; name: string; image: string };

interface MemberWishListProps {
  isMyPage: boolean;
  recipientName: string;
  items: WishlistUi[];
  eventId?: number;
}

const MemberWishList = ({ isMyPage, recipientName, items, eventId }: MemberWishListProps) => {
  const navigate = useNavigate();

  return (
    <section className="w-full mt-[32px] flex flex-col items-center">
      <div className="w-full max-w-[350px] px-2 flex justify-between items-center mb-[16px]">
        <h2 className="text-[18px] ml-2 font-semibold text-[#6282E1]">
          {recipientName}님 위시리스트
        </h2>
        {!isMyPage && (
          <button
            className="text-[12px] text-gray-400"
            onClick={() => navigate(`/vote-wish${eventId ? `?eventId=${eventId}` : ""}`)}
          >
            더보기 &gt;
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="w-full max-w-[350px] text-sm text-gray-400 px-2">
          등록된 위시리스트가 없어요.
        </div>
      ) : (
        <div className="w-full max-w-[350px] font-normal flex overflow-x-auto scrollbar-hide px-2">
          {items.map((it) => (
            <MemberWishItem key={it.id} imageUrl={it.image} title={it.name} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MemberWishList;

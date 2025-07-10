import { useNavigate } from "react-router-dom";
import MemberWishItem from "./MemberWishItem";
import { recipientDummy } from "./RecipientDummy";

interface MemberWishListProps {
  isMyPage: boolean;
}

const MemberWishList = ({ isMyPage }: MemberWishListProps) => {
  const navigate = useNavigate();

  return (
    <section className="w-full mt-[32px] flex flex-col items-center">
      <div className="w-full max-w-[350px] px-2 flex justify-between items-center mb-[16px]">
        <h2 className="text-[18px] ml-2 font-semibold text-black">
          {recipientDummy.name}님 위시리스트
        </h2>
        {!isMyPage && (
          <button
            className="text-[12px] text-gray-400"
            onClick={() => navigate("/vote-wish")}
          >
            더보기 &gt;
          </button>
        )}
      </div>
      <div className="w-full max-w-[350px] flex overflow-x-auto scrollbar-hide px-2">
        {recipientDummy.wishList.map((item, idx) => (
          <MemberWishItem
            key={idx}
            imageUrl={item.imageUrl}
            title={item.title}
          />
        ))}
      </div>
    </section>
  );
};

export default MemberWishList;

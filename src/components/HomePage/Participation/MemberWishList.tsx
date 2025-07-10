import { popularDummy } from "../List/WishList/PopularDummy";
import MemberWishItem from "./MemberWishItem";

interface MemberWishListProps {
  isMyPage: boolean;
}

const MemberWishList = ({ isMyPage }: MemberWishListProps) => {
  return (
    <section className="w-full mt-[32px] flex flex-col items-center">
      <div className="w-full max-w-[350px] px-2 flex justify-between items-center mb-[16px]">
        <h2 className="text-[18px] ml-2 font-semibold text-black">채원님 위시리스트</h2>
        {!isMyPage && (
          <button className="text-[12px] text-gray-400">{'더보기 >'}</button>
        )}
      </div>
      <div className="w-full max-w-[350px] flex overflow-x-auto scrollbar-hide px-2">
        {popularDummy.map((item, idx) => (
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

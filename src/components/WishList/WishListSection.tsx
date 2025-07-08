import { useState } from "react";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";
import WishListDummy from "./WishListDummy";

const WishListSection = () => {
  const [sort, setSort] = useState("등록순");

  return (
      <div className="w-[393px] justify-center px-4 py-6 space-y-2">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-black px-2">나의 위시리스트</h2>
          <SortDropdown selected={sort} onChange={setSort} />
        </div>

        {/* 위시리스트 아이템 리스트 */}
        <div className="w-full mx-auto flex flex-col gap-3">
          {WishListDummy.map((item) => (
            <WishlistItem
              key={item.id}
              imageSrc={item.imageSrc}
              title={item.title}
              price={item.price}
            />
          ))}
        </div>
      </div>
  );
};

export default WishListSection;

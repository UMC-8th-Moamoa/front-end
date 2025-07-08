import DummyWishListItem from "./DummyWishListItem";
import SortDropdown from "./SortDropDown";
import WishlistItem from "./WishListItem";

import { useState } from "react";

const WishListSection = () => {
  const [sort, setSort] = useState("등록순");

  return (
    <section className="px-4 py-6 space-y-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-black">나의 위시리스트</h2>
        <SortDropdown selected={sort} onChange={setSort} />
      </div>

      {/* 위시리스트 아이템 리스트 */}
      <div className="flex flex-col gap-3">
        {DummyWishListItem.map((item) => (
          <WishlistItem
            key={item.id}
            imageSrc={item.imageSrc}
            title={item.title}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default WishListSection;

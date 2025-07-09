import PopularItem from "./PopularItem";
import { popularDummy } from "./PopularDummy";

const PopularList = () => {
  return (
    <section className="mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-black mb-[16px]">
        20대 인기 위시리스트
      </h2>
      <div className="flex overflow-x-auto scrollbar-hide">
        {popularDummy.map((item, idx) => (
          <PopularItem key={idx} imageUrl={item.imageUrl} title={item.title} />
        ))}
      </div>
    </section>
  );
};

export default PopularList;

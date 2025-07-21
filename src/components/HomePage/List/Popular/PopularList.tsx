import PopularItem from "./PopularItem";
import { popularDummy } from "./PopularDummy";

const PopularList = () => {
  return (
    <section className="w-[393px] mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-2 mb-[16px]">
        20대 인기 위시리스트
      </h2>
      <div className="w-[350px] flex overflow-x-auto mx-auto scrollbar-hide">
        {popularDummy.map((item, idx) => (
          <PopularItem key={idx} imageUrl={item.imageUrl} title={item.title} />
        ))}
      </div>
    </section>
  );
};

export default PopularList;

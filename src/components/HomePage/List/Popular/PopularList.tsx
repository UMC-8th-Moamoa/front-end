import PopularItem from "./PopularItem";

interface PopularListProps {
  items: { imageUrl: string; title: string }[];
}

const PopularList = ({ items }: PopularListProps) => {
  // 가짜 비동기 API 함수
  const handleWishConfirm = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("✅ 위시리스트에 추가되었습니다!");
        resolve();
      }, 1000);
    });
  };

  return (
    <section className="w-[393px] mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-2 mb-[16px]">
        20대 인기 위시리스트
      </h2>
      <div className="w-[350px] flex overflow-x-auto mx-auto scrollbar-hide">
        {items.map((item, idx) => (
          <PopularItem
            key={idx}
            imageUrl={item.imageUrl}
            title={item.title}
            onConfirm={handleWishConfirm}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularList;

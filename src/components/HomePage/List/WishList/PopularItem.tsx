interface PopularItemProps {
  imageUrl: string;
  title: string;
}

const PopularItem = ({ imageUrl, title }: PopularItemProps) => {
  return (
    <div className="min-w-[119px] mr-[16px]">
      <div className="relative w-[119px] h-[119px] rounded-[16px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-[16px]"
        />
        <img
          src="/assets/WhitePlus.svg"
          alt="추가"
          className="absolute bottom-2 right-2 w-[24px] h-[24px]"
        />
      </div>
      <p className="mt-[8px] text-[12px] text-black">{title}</p>
    </div>
  );
};

export default PopularItem;

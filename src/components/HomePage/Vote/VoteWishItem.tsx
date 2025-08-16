import WhiteCheck from "../../../assets/WhiteCheck.svg";

interface VoteWishItemProps {
  imageUrl: string;
  title: string;
  price: number;
  selected: boolean;
  onSelect: () => void;
}

const VoteWishItem = ({
  imageUrl,
  title,
  price,
  selected,
  onSelect,
}: VoteWishItemProps) => {
  return (
    <label className="flex items-center w-[350px] h-[90px] bg-white rounded-[14px] px-2 py-2 gap-3 shadow-md cursor-pointer">
      {/* 이미지 */}
      <img
        src={imageUrl}
        alt={title}
        className="w-[80px] h-[80px] rounded-[10px] border border-[#B6B6B6] object-cover"
      />

      {/* 텍스트 */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[14px] text-black text-left">{title}</p>
        <p className="text-[20px] font-medium mt-1 text-black text-left">
          {price.toLocaleString()}원
        </p>
      </div>

      {/* 세로 선 */}
      <div className="w-px h-[80px] mr-2 bg-[#D9D9D9]" />

      {/* 체크박스(단일 선택 표시용) */}
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-[20px] h-[20px] mr-2 appearance-none rounded-sm border border-gray-400 checked:bg-[#6C4AB6] checked:border-[#6C4AB6] bg-center bg-no-repeat"
        style={{
          backgroundImage: selected ? `url(${WhiteCheck})` : undefined,
        }}
        aria-label={`${title} 선택`}
      />
    </label>
  );
};

export default VoteWishItem;

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
    <div
      className="flex items-center w-[350px] h-[90px] bg-white rounded-[14px] px-2 py-2 gap-3 shadow-md cursor-pointer"
      onClick={onSelect}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      {/* 이미지 */}
      <img
        src={imageUrl}
        alt={title}
        className="w-[80px] h-[80px] rounded-[10px] border border-[#B6B6B6] object-cover"
      />

      {/* 텍스트 */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[14px] text-black text-left line-clamp-2">{title}</p>
        <p className="text-[20px] font-medium mt-1 text-black text-left">
          {price.toLocaleString()}원
        </p>
      </div>

      {/* 세로 선 */}
      <div className="w-px h-[80px] mr-2 bg-[#D9D9D9]" />

      {/* 체크 표시 (버튼처럼) */}
      <div
        className={`w-[20px] h-[20px] mr-2 rounded-sm border flex items-center justify-center ${
          selected ? "bg-[#6282E1] border-[#6282E1]" : "border-gray-400"
        }`}
      >
        {selected && (
          <img src={WhiteCheck} alt="체크됨" className="w-[12px] h-[12px]" />
        )}
      </div>
    </div>
  );
};

export default VoteWishItem;

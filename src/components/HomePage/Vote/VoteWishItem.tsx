import clsx from "clsx";

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
    <label
      className={clsx(
        "flex items-center w-[350px] h-[90px] bg-white rounded-[14px] px-2 py-2 gap-3 shadow-md cursor-pointer"
        // 선택 효과에서 테두리 제거: border 관련 삭제
      )}
    >
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

      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-[20px] h-[20px] mr-2 appearance-none rounded-sm border border-gray-400 checked:bg-[#6C4AB6] checked:border-[#6C4AB6] checked:bg-[url('/assets/WhiteCheck.svg')] checked:bg-center checked:bg-no-repeat"
      />
    </label>
  );
};

export default VoteWishItem;

interface WishlistItemProps {
  imageSrc: string;
  title: string;
  price: string;
  onClickMenu?: () => void;
}

const WishlistItem = ({ imageSrc, title, price, onClickMenu }: WishlistItemProps) => {
  return (
    <div className="w-full max-w-[350px] bg-white rounded-xl shadow-sm flex p-4 gap-4">
      {/* 이미지 */}
      <img
        src={imageSrc}
        alt={title}
        className="w-[105px] h-[105px] rounded-xl object-cover border border-gray-100"
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-gray-900 leading-tight">{title}</p>
          <button onClick={onClickMenu} className="text-gray-400">
            <span className="text-xl">⋯</span>
          </button>
        </div>
        <p className="text-lg font-semibold text-black">{price}</p>
      </div>
    </div>
  );
};

export default WishlistItem;

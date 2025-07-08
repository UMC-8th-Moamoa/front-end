

interface WishlistItemProps {
  imageSrc: string;
  title: string;
  price: string;
  onClickMenu?: () => void;
}

const WishlistItem = ({ imageSrc, title, price, onClickMenu }: WishlistItemProps) => {
  return (
    <div className="w-full justify-center bg-white rounded-[14px] shadow-sm flex p-2 gap-4">
      <img
        src={imageSrc}
        alt={title}
        className="w-[105px] h-[105px] rounded-[10px] object-cover border border-gray-100"
      />

      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start">
          <p className="text-[15px] font-medium text-gray-900 leading-tight mt-4">{title}</p>

          <img 
            src="/assets/menu.svg"
            alt="메뉴"
            onClick={onClickMenu}
            className="w-[4px] h-[18px] object-contain cursor-pointer mt-4 mr-4"
          />
        </div>

        <p className="text-[20px] font-semibold text-black mb-2">{price}</p>
      </div>
    </div>
  );
};

export default WishlistItem;

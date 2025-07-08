import { useState } from 'react';

interface WishlistItemProps {
  imageSrc: string;
  title: string;
  price: string;
}

const WishlistItem = ({ imageSrc, title, price }: WishlistItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="w-full bg-white rounded-[14px] shadow-sm flex p-2 gap-4 relative">
      <img
        src={imageSrc}
        alt={title}
        className="w-[105px] h-[105px] rounded-[10px] object-cover border border-gray-100"
      />

      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start">
          <p className="text-[15px] font-medium text-gray-900 leading-tight mt-4">
            {title}
          </p>

          <div className="relative mt-4 mr-4">
            <img
              src="/assets/DotMenu.svg"
              alt="메뉴"
              onClick={toggleMenu}
              className="w-[4px] h-[18px] object-contain cursor-pointer"
            />

            {isMenuOpen && (
              <div className="absolute top-6 right-0 z-50 bg-white flex items-center rounded-[8px] shadow-md py-[4px] px-[20px] w-[96px] flex flex-col text-[15px]">
                <button className="text-black text-left py-1 mt-1 hover:opacity-80">수정하기</button>
                <button className="text-red-500 text-left py-1 hover:opacity-80 mt-2 mb-1">삭제</button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[20px] font-semibold text-black mb-2">{price}</p>
      </div>
    </div>
  );
};

export default WishlistItem;

import React, { useState } from 'react';
import Button from '../common/Button';

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string; // 선택적
  isOwned: boolean; // 아이템 보유 여부
};

interface ShoppingItemCardProps {
  item: Item;
  onBuy: (item: Item) => void;
}

const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item, onBuy }) => {
  const [imageError, setImageError] = useState(false);

  const showFallback = !item.image || imageError;

  return (
   <div className="w-[320px] h-[365px] bg-white rounded-[20px] shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
  
  {/* 이미지 */}
  {showFallback ? (
    <div className="w-full h-[165px] max-w-[310px] object-cover rounded-[10px] bg-gray-200 mb-1 flex items-center justify-center text-gray-500 text-xs">
      이미지 없음
    </div>
  ) : (
    <img
      src={item.image}
      alt={item.name}
      className="w-24 h-24 object-contain mb-3"
      onError={() => setImageError(true)}
    />
  )}

    {/* 텍스트 */}
    <div className="mt-3 text-left w-full px-4">
    <p className="text-[17px] font-semibold text-[#1F1F1F] mb-1">{item.name}</p>
    <p className="text-sm text-[#666666] mb-7">
        {item.description}
    </p>
    <p className="text-xl font-bold text-[#597EF7]">
        {item.price.toLocaleString()}MC
    </p>
    </div>

  {/* 버튼 */}
  <div className="mt-auto w-full px-2">
    <Button
        onClick={() => onBuy(item)}
        disabled={item.isOwned} // 보유중이면 비활성화
        fontSize="lg"
        size="sm"
        width="full"
    >
        {item.isOwned ? "보유중" : "구매하기"}
    </Button>
    </div>
</div>
  );
};

export default ShoppingItemCard;
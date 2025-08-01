import React, { useState } from 'react';
import Button from '../common/Button';

type Item = {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  isOwned?: boolean;
};

interface ShoppingItemCardProps {
  item: Item;
  onBuy: (item: Item) => void;
}

const ItemCardDetail: React.FC<ShoppingItemCardProps> = ({ item, onBuy }) => {
  const [imageError, setImageError] = useState(false);
  const showFallback = !item.image || imageError;

  return (
    <div className="w-[320px] h-[365px] bg-white rounded-[20px] shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
      
      {/* 이미지 영역 */}
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

      {/* 텍스트 영역 */}
      <div className="mt-3 text-left w-full px-4">
        <p className="text-[17px] font-semibold text-[#1F1F1F] mb-1">
          {item.name}
        </p>
        <p className="text-sm text-[#666666] mb-7">
          {item.description || '설명이 없습니다.'}
        </p>
        <p className="text-xl font-bold text-[#597EF7]">
          {item.price !== undefined ? `${item.price.toLocaleString()}MC` : '가격 정보 없음'}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex mt-auto w-full">
        <Button
          onClick={() => onBuy(item)}
          disabled={item.isOwned || item.price === undefined}
          fontSize="lg"
          size="sm"
          width="full"
        >
          {item.isOwned ? '보유중' : item.price === undefined ? '구매 불가' : '구매하기'}
        </Button>
      </div>
    </div>
  );
};

export default ItemCardDetail;
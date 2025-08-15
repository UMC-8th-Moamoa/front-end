// src/components/Shopping/ItemCardDetail.tsx
import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import api from '../../api/axiosInstance';

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
  category?: 'font' | 'paper' | 'seal'; 
}

/** 상세 응답 타입 (배열로 내려옴) */
type DetailItem = {
  item_no: number;
  name: string;
  detail?: string;
  price?: number;
  image?: string;
};
type DetailResponse = {
  success: boolean;
  item?: DetailItem[];
};

const ItemCardDetail: React.FC<ShoppingItemCardProps> = ({ item, onBuy, category }) => {
  const [imageError, setImageError] = useState(false);
  const [detail, setDetail] = useState<string>(item.description ?? '');
  const [price, setPrice] = useState<number | undefined>(item.price);
  const [image, setImage] = useState<string | undefined>(item.image);
  const [loading, setLoading] = useState<boolean>(false);

  // 상세 정보 불러오기
  useEffect(() => {
    let ignore = false;

    async function load() {
      // 카테고리/아이디 없으면 호출 안 함 (초기 props만 사용)
      if (!category || item.id == null) return;

      // 허용된 카테고리만
      if (!['font', 'paper', 'seal'].includes(category)) return;

      try {
        setLoading(true);
        const { data } = await api.get<DetailResponse>('/shopping/item_list', {
          params: { category, id: item.id },
        });

        // ✅ 배열 첫 원소에서 상세 추출
        const first = Array.isArray(data?.item) ? data.item![0] : undefined;

        if (!ignore && data?.success && first) {
          if (typeof first.detail === 'string') setDetail(first.detail);
          if (typeof first.price === 'number') setPrice(first.price);
          if (typeof first.image === 'string') {
            setImage(first.image);
            setImageError(false);
          }
        }
      } catch (e) {
        console.warn('[ITEM DETAIL] failed', e);
        // 실패 시 기존 값 유지
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [category, item.id]);

  const showFallback = !image || imageError;

  return (
    <div className="relative w-[320px] h-[365px] bg-white rounded-[20px] shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow z-[1001]">
      {/* 이미지 영역 */}
      {showFallback ? (
        <div className="w-full h-[165px] max-w-[310px] rounded-[10px] bg-gray-200 mb-1 flex items-center justify-center text-gray-500 text-xs">
          이미지 없음
        </div>
      ) : (
        <img
          src={image}
          alt={item.name}
          className="w-[310px] h-[165px] object-contain mb-1 rounded-[10px]"
          onError={() => setImageError(true)}
        />
      )}

      {/* 텍스트 영역 */}
      <div className="mt-3 text-left w-full px-4">
        <p className="text-[17px] font-semibold text-[#1D1D1F] mb-1">
          {item.name}
        </p>
        <p className="text-sm text-[#666666] mb-7">
          {loading ? '불러오는 중…' : (detail || '설명이 없습니다.')}
        </p>
        <p className="text-xl font-bold text-[#597EF7]">
          {typeof price === 'number' ? `${price.toLocaleString()}MC` : '가격 정보 없음'}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex mt-auto w-full">
        <Button
          onClick={() => onBuy({ ...item, description: detail, price, image })}
          disabled={item.isOwned || typeof price !== 'number'}
          fontSize="lg"
          size="sm"
          width="full"
        >
          {item.isOwned ? '보유중' : typeof price !== 'number' ? '구매 불가' : '구매하기'}
        </Button>
      </div>
    </div>
  );
};

export default ItemCardDetail;
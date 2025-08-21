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

type DetailItem = {
  item_no: number;
  name: string;
  detail?: string;
  price?: number;
  image?: string;
};

// 서버가 래퍼/평문/배열/객체 등 다양한 형태로 줄 수 있으므로 포괄 타입
type DetailEnvelope =
  | {
      resultType?: 'SUCCESS' | 'FAIL';
      success?: any;     // { success?: boolean; item?: DetailItem[] | DetailItem } 등
      error?: unknown;
    }
  | {
      success?: boolean;
      item?: DetailItem[] | DetailItem;
      // 혹은 루트 직렬 형식으로 직접 반환될 수도 있음
      item_no?: number;
      name?: string;
      detail?: string;
      price?: number;
      image?: string;
      imageUrl?: string;
      img?: string;
    };

const ItemCardDetail: React.FC<ShoppingItemCardProps> = ({ item, onBuy }) => {
  const [imageError, setImageError] = useState(false);
  const [detail, setDetail] = useState<string>(item.description ?? '');
  const [price, setPrice] = useState<number | undefined>(item.price);
  const [image, setImage] = useState<string | undefined>(item.image);
  const [loading, setLoading] = useState<boolean>(false);

  // 응답 정규화: 어떤 형태로 와도 DetailItem 하나로 통일
  const extractDetail = (data: DetailEnvelope): DetailItem | undefined => {
    const payload: any = (data as any)?.success ?? data;

    if (payload?.itemDetailEntry && typeof payload.itemDetailEntry === 'object') {
    const v = payload.itemDetailEntry;
    return {
      item_no: Number(v.item_no),
      name: v.name,
      detail: v.detail,
      price: typeof v.price === 'number' ? v.price : undefined,
      image: v.image ?? v.imageUrl ?? v.img,
    };
  }

    // 1) payload.item 이 배열인 경우
    if (Array.isArray(payload?.item)) return payload.item[0];

    // 2) payload.item 이 객체인 경우
    if (payload?.item && typeof payload.item === 'object') return payload.item as DetailItem;

    // 3) 루트 직렬로 들어온 경우
    if (payload && (payload.item_no || payload.name || payload.detail || payload.price || payload.image)) {
      return {
        item_no: Number(payload.item_no ?? item.id),
        name: payload.name,
        detail: payload.detail,
        price: typeof payload.price === 'number' ? payload.price : undefined,
        image: payload.image ?? payload.imageUrl ?? payload.img,
      };
    }

    return undefined;
  };

  useEffect(() => {
    let ignore = false;

    async function load(retry = false) {
      if (item.id == null) return;

      try {
        setLoading(true);
        const { data } = await api.get<DetailEnvelope>('/shopping/item_detail', {
          params: { id: Number(item.id), _t: Date.now() },
          headers: { 'Cache-Control': 'no-cache' },
        });

        const first = extractDetail(data);

        if (!ignore && first) {
          if (typeof first.detail === 'string') setDetail(first.detail);
          if (typeof first.price === 'number') setPrice(first.price);

          const img = first.image as string | undefined;
          if (img) {
            setImage(img);
            setImageError(false);
          }
        }
      } catch (e) {
        // 간헐적 502 대비 1회 재시도
        if (!retry) {
          await new Promise((r) => setTimeout(r, 200));
          if (!ignore) await load(true);
        } else {
          console.warn('[ITEM DETAIL] failed', e);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };

  }, [item.id]);


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
        <p className="text-[17px] font-semibold text-[#1F1F1F] mb-1">{item.name}</p>
        <p className="text-sm text-[#666666] mb-3">
          {loading ? '불러오는 중…' : (detail || '설명이 없습니다.')}
        </p>
        <p className="text-xl font-bold text-[#597EF7] mb-2">
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
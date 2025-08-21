// src/components/Shopping/ItemCardDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  onBuy: (item: Item) => void;               // 부모의 구매 핸들러(모달/구매 확정 등)
  category?: 'font' | 'paper' | 'seal';
}

type DetailItem = {
  item_no: number;
  name: string;
  detail?: string;
  price?: number;
  image?: string;
};

type DetailEnvelope =
  | {
      resultType?: 'SUCCESS' | 'FAIL';
      success?: any;
      error?: unknown;
    }
  | {
      success?: boolean;
      item?: DetailItem[] | DetailItem;
      item_no?: number;
      name?: string;
      detail?: string;
      price?: number;
      image?: string;
      imageUrl?: string;
      img?: string;
    };

const ItemCardDetail: React.FC<ShoppingItemCardProps> = ({ item, onBuy }) => {
  const navigate = useNavigate();

  const [imageError, setImageError] = useState(false);
  const [detail, setDetail] = useState<string>(item.description ?? '');
  const [price, setPrice] = useState<number | undefined>(item.price);
  const [image, setImage] = useState<string | undefined>(item.image);
  const [loading, setLoading] = useState<boolean>(false);

  //잔액 상태
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // 응답 정규화
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

    if (Array.isArray(payload?.item)) return payload.item[0];
    if (payload?.item && typeof payload.item === 'object') return payload.item as DetailItem;

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

  //상세 불러오기
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
    return () => { ignore = true; };
  }, [item.id]);

  //보유 MC 잔액 조회
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setBalanceError(null);
        const { data } = await api.get('/payment/balance', {
          params: { _t: Date.now() },
          headers: { 'Cache-Control': 'no-cache' },
          withCredentials: true,
        });
        const s = data?.success ?? data;
        const core = s?.data ?? s;
        const bal = Number(core?.balance);
        if (!Number.isFinite(bal)) throw new Error('잔액 값을 파싱할 수 없습니다.');
        if (!cancelled) setBalance(bal);
      } catch (e: any) {
        if (!cancelled) {
          setBalance(0);
          setBalanceError(e?.response?.status === 401 ? '로그인이 필요합니다.' : '잔액 조회 실패');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const showFallback = !image || imageError;

  const priceNum = typeof price === 'number' ? price : NaN;
  const bal = balance ?? 0;
  const canAfford = Number.isFinite(priceNum) && bal >= priceNum;

  const buyDisabled =
    item.isOwned ||
    !Number.isFinite(priceNum) ||
    balance === null || 
    !canAfford;

  const buyLabel =
    item.isOwned
      ? '보유중'
      : balance === null
      ? '잔액 확인 중…'
      : !Number.isFinite(priceNum)
      ? '구매 불가'
      : canAfford
      ? '구매하기'
      : '충전 필요';

  const handleClick = () => {
    if (buyDisabled) {
      // 잔액 부족 → 충전 화면으로 이동
      if (balance !== null && !canAfford) navigate('/purchase');
      return;
    }
    onBuy({ ...item, description: detail, price, image });
  };

  return (
    <div className="relative w-[320px] h-[385px] bg-white rounded-[20px] shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow z-[2000]">
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

        <div className="flex items-baseline justify-between">
          <p className="text-xl font-bold text-[#597EF7] mb-2">
            {Number.isFinite(priceNum) ? `${priceNum.toLocaleString()}MC` : '가격 정보 없음'}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {balanceError ? balanceError : balance === null ? '' : ``}
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex mt-auto w-full">
        <Button
          onClick={handleClick}
          disabled={buyDisabled}
          fontSize="lg"
          size="sm"
          width="full"
        >
          {buyLabel}
        </Button>
      </div>
    </div>
  );
};

export default ItemCardDetail;
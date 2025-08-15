// src/components/Purchase/PurchaseTopBar.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import BackButton from '../common/BackButton';

type Props = {
  /** 초기 표시값 (로딩 전 폴백) */
  userMC?: number;
};

type PointsSuccess =
  | { points?: number; mc?: number; balance?: number }
  | number;

type Envelope<T> = {
  resultType?: 'SUCCESS' | 'FAIL';
  error?: { errorCode: string; reason?: string | null } | null;
  success?: T | null;
};

const extractPoints = (data: any, fallback: number) => {
  const s = (data?.success ?? data) as PointsSuccess | undefined;
  if (s == null) return fallback;

  if (typeof s === 'number') return s;
  if (typeof s.points === 'number') return s.points;
  if (typeof s.mc === 'number') return s.mc;
  if (typeof s.balance === 'number') return s.balance;
  return fallback;
};

const PurchaseTopBar = ({ userMC = 0 }: Props) => {
  const navigate = useNavigate();
  const [points, setPoints] = useState<number>(userMC);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Envelope<PointsSuccess>>('/points', {
          params: { _t: Date.now() },
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!ignore) {
          const p = extractPoints(data, userMC);
          setPoints(p);
        }
      } catch {
        if (!ignore) setPoints(userMC);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [userMC]);

  return (
    <div className="w-[393px] h-14 flex items-center justify-between px-1 relative">
      {/* 좌측 뒤로가기 버튼 */}
      <BackButton />

      {/* 중앙 제목 */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-[#1F1F1F]">
        몽코인 충전소
      </h1>

      {/* 우측 MC 뱃지 (클릭 시 /purchase 이동) */}
      <button
        type="button"
        onClick={() => navigate('/purchase')}
        className="bg-[#E7EDFF] text-[#6282E1] text-sm font-semibold px-3 py-1 rounded-full cursor-pointer active:scale-95 transition"
      >
        {loading ? '...' : `${points}MC`}
      </button>
    </div>
  );
};

export default PurchaseTopBar;
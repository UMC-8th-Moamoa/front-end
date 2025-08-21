// src/components/Shopping/ShoppingTopBar.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

type Props = {
  /** 초기 표시용(로딩 전 폴백). 없으면 0으로 시작 */
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
  // 래퍼/비래퍼 모두 대응
  const s = (data?.success ?? data) as PointsSuccess | undefined;
  if (s == null) return fallback;

  if (typeof s === 'number') return s;
  if (typeof s.points === 'number') return s.points;
  if (typeof s.mc === 'number') return s.mc;
  if (typeof s.balance === 'number') return s.balance;
  return fallback;
};

const ShoppingTopBar = ({ userMC = 0 }: Props) => {
  const navigate = useNavigate();
  const [points, setPoints] = useState<number>(userMC);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        // axiosInstance가 baseURL=/api 이므로 여기서는 '/points'만 적음
        const { data } = await api.get('/payment/balance', {
          headers: { 'Cache-Control': 'no-cache' },
          params: { _t: Date.now() },
          withCredentials: true,           // RT 쿠키 쓰면 유지
        });
        if (!ignore) {
          const p = extractPoints(data, userMC);
          setPoints(p);
        }
      } catch (e: any) {
        // 401 등 에러 시에는 초기값 유지
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
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4">
      {/* 중앙 로고 */}
      <img
        src="/assets/MoamoaLogo.svg"
        alt="MOA MOA"
        className="h-[18px] absolute left-1/2 transform -translate-x-1/2"
      />

      {/* 우측 MC 뱃지 (클릭 시 /purchase 이동) */}
      <button
        type="button"
        onClick={() => navigate('/purchase')}
        className="absolute right-1 bg-[#E7EDFF] text-[#6282E1] text-sm font-semibold px-3 py-1 rounded-full cursor-pointer active:scale-95 transition"
        title="충전/결제 페이지로 이동"
      >
        {loading ? '...' : `${points}MC`}
      </button>
    </div>
  );
};

export default ShoppingTopBar;
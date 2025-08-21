// src/pages/Shopping/ShoppingList.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  fetchItemList,
  fetchUserItems,
  buyItem,
  fetchItemDetail,        // 상세 정보 보강용
  type ShopItem,
  type UserItem
} from '../../api/shopping';
import { useNavigate } from 'react-router-dom';

import ShoppingTopBar from '../../components/Shopping/ShoppingTopBar';
import BottomNavigation, { type MenuType } from '../../components/common/BottomNavigation';
import { TopMenu } from '../../components/Shopping/TopMenu';
import { ShopHeader } from '../../components/Shopping/ShopHeader';
import ItemCardDetail from '../../components/Shopping/ItemCardDetail';
import { Modal } from '../../components/common/Modal';
import toast, { Toaster } from 'react-hot-toast';
import ItemCard from '../../components/Shopping/ItemCard';
import api from '../../api/axiosInstance';

type UiTab = '폰트' | '편지지' | '우표' | '보관함';
type ApiCategory = 'font' | 'paper' | 'seal';

/** JWT payload 디코더 (검증 없이 payload만 파싱) */
function parseJwt<T = any>(token?: string | null): T | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/** /auth/me 로 사용자 정보 조회 (필요 시) */
async function fetchMe(): Promise<{ user_id?: string } | null> {
  try {
    const { data } = await api.get('/auth/me', {
      headers: { 'Cache-Control': 'no-cache' },
      params: { _t: Date.now() },
    });
    const s = data?.success ?? data;
    return (s?.user ?? s) ?? null;
  } catch {
    return null;
  }
}

/** 문자열 user_id 확보: 1) localStorage 2) /auth/me 3) AT payload.user_id */
async function ensureUserId(): Promise<string | null> {
  const saved = localStorage.getItem('user_id');
  if (saved) return String(saved);

  const me = await fetchMe();
  if (me?.user_id) {
    localStorage.setItem('user_id', me.user_id);
    return me.user_id;
  }

  const at = localStorage.getItem('accessToken');
  const payload = parseJwt<{ user_id?: string | number; userId?: string | number }>(at);
  const pid = payload?.user_id ?? payload?.userId;
  if (pid != null) {
    const idStr = String(pid);
    localStorage.setItem('user_id', idStr);
    return idStr;
  }
  return null;
}

export default function ShoppingList() {
  const navigate = useNavigate();

  // 상점 목록
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 보관함 목록
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // UI 상태
  // const userMC = 20; // 예시
  const [userMC, setUserMC] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<UiTab>('폰트');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false); // 이중 클릭 방지

  const fetchBalance = async () => {
  try {
    setBalanceError(null);
    const { data } = await api.get('/payment/balance', {
      headers: { 'Cache-Control': 'no-cache' },
      params: { _t: Date.now() }, // 캐시 버스터
      withCredentials: true,       // RT를 쿠키에 둘 때
    });

    // 래퍼/비래퍼 모두 흡수
    const s = data?.success ?? data;
    const core = s?.data ?? s;
    const bal = Number(core?.balance);
    if (!Number.isFinite(bal)) throw new Error('잔액 값을 파싱할 수 없습니다.');
    setUserMC(bal);
  } catch (e: any) {
    setUserMC(0);
    if (e?.response?.status === 401) {
      setBalanceError('로그인이 필요합니다.');
    } else {
      setBalanceError(e?.message || '잔액 조회에 실패했습니다.');
    }
  }
};

  // API 카테고리 (envelope 제거, seal 사용)
  const apiCategory = useMemo<ApiCategory | null>(() => {
    switch (selectedTab) {
      case '폰트': return 'font';
      case '편지지': return 'paper';
      case '우표': return 'seal';
      default: return null;
    }
  }, [selectedTab]);

  // 상점 목록 호출
  useEffect(() => {
    if (!apiCategory) {
      setItems([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const payload = await fetchItemList(apiCategory, 10);
        const list = payload.item ?? [];
        if (payload.success && Array.isArray(list)) {
          setItems(list);
        } else {
          setItems([]);
          setLoadError('목록을 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setItems([]);
        setLoadError(e?.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [apiCategory]);

  // 보관함 목록 호출 + (이름/이미지 비어있으면) 상세 API로 보강
  const loadUserItems = async () => {
    try {
      setUserLoading(true);
      setUserError(null);

      const res = await fetchUserItems(20); // JWT 필요
      const base = res.success ? (res.itemListEntry ?? []) : [];

      // name이 비거나 공백인 항목만 상세 API로 보강
      const needLookup = base.filter(u => !u.name || !u.name.trim());
      if (needLookup.length) {
        // (category,item_no) 단위 중복 제거
        const keys = new Map<string, UserItem>();
        needLookup.forEach(u => {
          if (u.item_no == null) return;
          const key = `${u.category}|${u.item_no}`;
          if (!keys.has(key)) keys.set(key, u);
        });

        const results = await Promise.all(
          Array.from(keys.values()).map(async (u) => {
            const { name, image } = await fetchItemDetail({
              category: u.category,
              id: Number(u.item_no),
            });
            return { key: `${u.category}|${u.item_no}`, name, image };
          })
        );

        const map = new Map<string, { name?: string; image?: string }>();
        results.forEach(({ key, name, image }) => map.set(key, { name, image }));

        const enriched = base.map(u => {
          if (u.item_no == null) return u;
          const key = `${u.category}|${u.item_no}`;
          const found = map.get(key);
          if (!found) return u;
          return {
            ...u,
            name: u.name?.trim() ? u.name : (found.name ?? ''),
            image: u.image ?? found.image,
          };
        });

        setUserItems(enriched);
      } else {
        setUserItems(base);
      }
    } catch (e: any) {
      setUserItems([]);
      if (e?.response?.status === 401) setUserError('로그인이 필요합니다.');
      else setUserError(e?.message || '보관함을 불러오지 못했습니다.');
    } finally {
      setUserLoading(false);
    }
  };

  // 탭이 보관함일 때만 로딩
  useEffect(() => {
    if (selectedTab === '보관함') {
      loadUserItems();
    }
  }, [selectedTab]);

  const handleBuy = (item: any) => {
    const balance = userMC ?? 0;
      if (balance < (item.price ?? 0)) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white rounded-xl shadow-md px-6 py-4 w-[330px] text-center`}>
          <p className="text-base font-base text-black mb-2">몽코인이 부족합니다</p>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/purchase');
            }}
            className="text-[#6282E1] border border-[#6282E1] w-full rounded-lg px-4 py-2 text-sm font-base hover:bg-[#F1F4FF] active:border-2"
          >
            몽코인 충전하러 가기
          </button>
        </div>
      ));
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  /** 구매 확정 → /api/shopping/item_buy, 성공/중복 모두 보관함 갱신 */
  const handleConfirmBuy = async () => {
    if (!selectedItem || !apiCategory || purchasing) return;

    try {
      setPurchasing(true);

      const userId = await ensureUserId();
      if (!userId) {
        toast.error('로그인이 필요합니다.');
        setIsModalOpen(false);
        navigate('/login');
        return;
      }

      const event = Number(selectedItem.price ?? 0) === 0;
      const body = {
        category: apiCategory as ApiCategory,
        user_id: userId,             
        item_no: Number(selectedItem.id),
        price: Number(selectedItem.price ?? 0),
        event,
      };

      const { data } = await buyItem(body);

      const ok =
        data?.success === true ||
        data?.resultType === 'SUCCESS' ||
        data?.success?.success === true;

      if (ok) {
        toast.success(`${selectedItem.name} 구매 완료!`);
      } else {
        const reason = data?.error?.reason || data?.success?.message || '';
        if (/Unique constraint|이미 보유/i.test(reason)) {
          toast.success('이미 보유중인 아이템입니다.');
        } else {
          toast.error(reason || '구매에 실패했습니다.');
        }
      }

      // 보관함 갱신 + 탭 전환
      await loadUserItems();
      setSelectedTab('보관함');
    } catch (err: any) {
      const reason =
        err?.response?.data?.error?.reason ||
        err?.message ||
        '구매 중 오류가 발생했습니다.';
      if (err?.response?.status === 401) {
        toast.error('로그인이 필요합니다.');
        navigate('/login');
      } else if (/Unique constraint|이미 보유/i.test(String(reason))) {
        toast.success('이미 보유중인 아이템입니다.');
        await loadUserItems();
        setSelectedTab('보관함');
      } else {
        toast.error(reason);
        console.error('[ITEM BUY ERROR]', err);
      }
    } finally {
      setPurchasing(false);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const getHeaderProps = () => {
    switch (selectedTab) {
      case '보관함':
        return {
          title: '아이템 보관함',
          type: 'filter' as const,
          options: ['전체 보기', '폰트', '편지지', '편지봉투'],
        };
      default:
        return {
          title: '신규 출시',
          type: 'sort' as const,
          options: ['최신 출시', '최초 출시', '높은 가격순', '낮은 가격순'],
        };
    }
  };

  const [selectedOption, setSelectedOption] = useState(getHeaderProps().options[0]);
  useEffect(() => {
    setSelectedOption(getHeaderProps().options[0]);
  }, [selectedTab]);

  const handleNavigate = (menu: MenuType) => {
    switch (menu) {
      case 'shopping': navigate('/shopping'); break;
      case 'heart': navigate('/wishlist'); break;
      case 'home': navigate('/home'); break;
      case 'letter': navigate('/moaletter/preview'); break;
      case 'mypage': navigate('/mypage'); break;
    }
  };

  // 보관함 UI
  const renderUserItems = () => {
    if (userLoading) return <p className="text-sm text-gray-500 px-4 py-4">불러오는 중…</p>;
    if (userError) {
      return (
        <div className="px-4 py-4">
          <p className="text-sm text-red-500 mb-3">{userError}</p>
          {userError.includes('로그인') && (
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-2 text-sm rounded-lg border border-[#6282E1] text-[#6282E1]"
            >
              로그인 하러가기
            </button>
          )}
        </div>
      );
    }
    if (!userItems.length) return <p className="text-sm text-gray-500 px-4 py-4">보관함이 비어 있어요.</p>;

    return (
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {userItems.map((it) => (
          <ItemCard
            key={it.holditem_id}
            id={String(it.holditem_id)}
            name={it.name?.trim() || '이름 없음'}
            imageUrl={it.image}
            priceLabel="보유중"
            onClick={() =>
              setSelectedItem({
                id: it.item_no,                  // 상세 조회에 쓰는 원본 아이템 id
                name: it.name,
                image: it.image,
                category: it.category,           // 'font' | 'paper' | 'seal'
                price: undefined,
            })
          }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-[393px] mx-auto flex flex_col justify-between bg-white">
      <div className="w-full flex flex-col relative">
        <ShoppingTopBar userMC={userMC ?? 0} />
        <TopMenu selected={selectedTab} onChange={setSelectedTab} />
        <ShopHeader
          title={getHeaderProps().title}
          type={getHeaderProps().type}
          options={getHeaderProps().options}
          selected={selectedOption}
          onSelect={setSelectedOption}
        />

        {/* 아이템 목록 / 보관함 전환 렌더 */}
        {selectedTab === '보관함' ? (
          renderUserItems()
        ) : (
          apiCategory && (
            <div className="px-4 py-4">
              {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
              {loadError && <p className="text-sm text-red-500">{loadError}</p>}
              {!loading && !loadError && (
                <div className="grid grid-cols-2 gap-3">
                  {items.map((it) => {
                    const priceLabel = (it.price ?? 0) === 0 ? '무료' : `${it.price.toLocaleString()}MC`;
                    return (
                      <ItemCard
                        key={it.item_no}
                        id={String(it.item_no)}
                        name={it.name}
                        imageUrl={it.image}
                        priceLabel={priceLabel}
                        onClick={() =>
                          setSelectedItem({
                            id: it.item_no,
                            name: it.name,
                            price: it.price,
                            image: it.image,
                            category: apiCategory,
                          })
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}

        {/* 상세 카드 오버레이 (상점 리스트에서만 열림) */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative z-120" onClick={(e) => e.stopPropagation()}>
              <ItemCardDetail item={selectedItem} onBuy={handleBuy} category={selectedItem.category} />
            </div>
          </div>
        )}

        {/* 구매 확인 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-[330px] px-5 py-6">
          <p className="text-center text-base font-base text-[#1D1D1F] mb-4 leading-[24px]">
            {selectedItem?.name}을 구매하시겠습니까?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-[120px] py-2 border border-[#6282E1] text-[#6282E1] rounded-[10px] text-sm font-medium"
              disabled={purchasing}
            >
              취소
            </button>
            <button
              onClick={handleConfirmBuy}
              className="w-[120px] py-2 bg-[#6282E1] text-white rounded-[10px] text-sm font-medium"
              disabled={purchasing}
            >
              {purchasing ? '구매 중…' : '확인'}
            </button>
          </div>
        </Modal>

        {/* 하단 네비게이션 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 bg-white w-full max-w-[393px]">
          <BottomNavigation active="shopping" onNavigate={handleNavigate} />
        </footer>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
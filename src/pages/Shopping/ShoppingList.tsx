// ShoppingList.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingTopBar from '../../components/Shopping/ShoppingTopBar';
import BottomNavigation from '../../components/common/BottomNavigation';
import { TopMenu } from '../../components/Shopping/TopMenu';
import { ShopHeader } from '../../components/Shopping/ShopHeader';
import { AdBanner } from '../../components/Shopping/AdBanner';
import { TabContent } from '../../components/Shopping/TabContent';
import ItemCardDetail from '../../components/Shopping/ItemCardDetail';
import { Modal } from '../../components/common/Modal';
import toast, { Toaster } from 'react-hot-toast';

type MenuType = 'shopping' | 'heart' | 'home' | 'letter' | 'mypage';

export default function ShoppingList() {
  const navigate = useNavigate();
  const location = useLocation();

  // 경로에 따라 active 메뉴 자동 설정
  const pathToMenuMap: Record<string, MenuType> = {
    '/shopping': 'shopping',
    '/wishlist': 'heart',
    '/home': 'home',
    '/messages': 'letter',
    '/mypage': 'mypage',
  };
  const activeMenu: MenuType = pathToMenuMap[location.pathname] || 'shopping';

  const handleNavigate = (menu: MenuType) => {
    const menuToPathMap: Record<MenuType, string> = {
      shopping: '/shopping',
      heart: '/wishlist',
      home: '/home',
      letter: '/messages',
      mypage: '/mypage',
    };
    navigate(menuToPathMap[menu]);
  };

  const userMC = 20; // 예시값
  const [selectedTab, setSelectedTab] = useState('폰트');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bannerImages: Record<string, string> = {
  폰트: '/banners/font-banner.png',
  편지지: '/banners/paper-banner.png',
  우표: '/banners/stamp-banner.png',
};

  const handleBuy = (item: any) => {
    if (userMC < item.price) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } bg-white rounded-xl shadow-md px-6 py-4 w-[330px] text-center`}
        >
          <p className="text-base font-base text-black mb-2">
            몽코인이 부족합니다
          </p>
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

  const handleConfirmBuy = () => {
    if (!selectedItem) return;
    toast.success(`${selectedItem.name} 구매 완료!`);
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getHeaderProps = () => {
    switch (selectedTab) {
      case '보관함':
        return {
          title: '아이템 보관함',
          type: 'filter',
          options: ['전체 보기', '폰트', '편지지', '편지봉투'],
        };
      default:
        return {
          title: '신규 출시',
          type: 'sort',
          options: ['최신 출시', '최초 출시', '높은 가격순', '낮은 가격순'],
        };
    }
  };

  const [selectedOption, setSelectedOption] = useState(getHeaderProps().options[0]);

  useEffect(() => {
    setSelectedOption(getHeaderProps().options[0]);
  }, [selectedTab]);

  return (
    <div className="min-h-screen max-w-[393px] mx-auto flex flex-col justify-between bg-white">
      <div className="w-full flex flex-col justify-center relative">
        <ShoppingTopBar userMC={userMC} />
        <TopMenu selected={selectedTab} onChange={setSelectedTab} />
        <ShopHeader
          title={getHeaderProps().title}
          type={getHeaderProps().type}
          options={getHeaderProps().options}
          selected={selectedOption}
          onSelect={setSelectedOption}
        />

        {selectedTab !== '보관함' && (
          <AdBanner imageUrl={bannerImages[selectedTab]} />
        )}

        <TabContent
          selectedTab={selectedTab}
          onItemClick={(item) => setSelectedItem(item)}
        />

        {/* 상세 카드 오버레이 */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative z-60"
              onClick={(e) => e.stopPropagation()} // 카드 내부 클릭 시 닫힘 방지
            >
              <ItemCardDetail item={selectedItem} onBuy={handleBuy} />
            </div>
          </div>
        )}

        {/* 구매 확인 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="w-[330px] px-5 py-6"
        >
          <p className="text-center text-base font-base text-[#1D1D1F] mb-4 leading-[24px]">
            {selectedItem?.name}을 구매하시겠습니까?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-[120px] py-2 border border-[#6282E1] text-[#6282E1] rounded-[10px] text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={handleConfirmBuy}
              className="w-[120px] py-2 bg-[#6282E1] text-white rounded-[10px] text-sm font-medium"
            >
              확인
            </button>
          </div>
        </Modal>

        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 bg-white w-full max-w-[393px]">
          <BottomNavigation active={activeMenu} onNavigate={handleNavigate} />
        </footer>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
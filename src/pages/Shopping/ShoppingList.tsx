import { useState, useEffect } from "react";
import ShoppingTopBar from "../../components/Shopping/ShoppingTopBar";
import BottomNavigation from "../../components/common/BottomNavigation";
import { TopMenu } from "../../components/Shopping/TopMenu";
import { TabContent } from "../../components/Shopping/TabContent";
import { ShopHeader } from "../../components/Shopping/ShopHeader";
// import AdBanner from "../../components/Shopping/AdBanner";


export default function ShoppingList() {
  const userMC = 120; // 예시값
  const [selectedTab, setSelectedTab] = useState('폰트');
  
  const getHeaderProps = () => {
    switch (selectedTab) {
        case '보관함':
        return {
            title: '아이템 보관함',
            type: 'filter',
            options: ['전체 보기', '폰트', '편지지', '편지봉투'],
        }
        default:
        return {
            title: '신규 출시',
            type: 'sort',
            options: ['최신 출시', '최초 출시', '높은 가격순', '낮은 가격순'],
        }
    }
    }

    const [selectedOption, setSelectedOption] = useState(getHeaderProps().options[0])
    const headerProps = getHeaderProps()

      useEffect(() => {
    setSelectedOption(getHeaderProps().options[0]);
  }, [selectedTab]);

  return (
    <div className="min-h-screen flex flex-col justify-start bg-white">
      {/* 상단 헤더 */}
      <ShoppingTopBar userMC={userMC} />
 
      {/* 본문 */}
      <TopMenu selected={selectedTab} onChange={setSelectedTab} />
      

      <ShopHeader
        title={headerProps.title}
        type={headerProps.type}
        options={headerProps.options}
        selected={selectedOption}
        onSelect={setSelectedOption}
        />

        <TabContent selectedTab={selectedTab} />
      {/* <AdBanner /> */}


      {/* BottomNavigation 고정 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white w-full max-w-[393px]">
          <BottomNavigation />
        </footer>
    </div>
  );
}
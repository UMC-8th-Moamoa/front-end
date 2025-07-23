type TabContentProps = {
  selectedTab: keyof typeof mockData;
};

const mockData = {
  폰트: ['폰트1', '폰트2', '폰트3'],
  편지지: ['편지지1', '편지지2'],
  우표: ['우표1', '우표2', '우표3', '우표4'],
  보관함: ['보관1'],
};

const dummyItems = Array.from({ length: 6 });

export const TabContent = ({ selectedTab }: TabContentProps) => {
    console.log('선택된 탭:', selectedTab);
  const items = mockData[selectedTab] || [];

  return (
    <div className="p-4">

       <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 pt-4">
      {dummyItems.map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-200 h-24 rounded-t-xl" />
          <div className="p-2 text-center text-sm font-medium text-black">아이템명</div>
          <div className="text-center text-xs text-[#3634A3] pb-2">
            {idx % 3 === 0 ? '무료' : idx % 3 === 1 ? '100MC' : '보유중'}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};
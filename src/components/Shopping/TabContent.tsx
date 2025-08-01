import ItemCard from './ItemCard';

interface Item {
  id: string;
  name: string;
  priceLabel: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  isOwned?: boolean;
  releaseDate?: string; 
}

type TabContentProps = {
  selectedTab: keyof typeof dummyData;
  selectedOption: string;
  onItemClick: (item: Item) => void;
};

const dummyData: Record<string, Item[]> = {
  폰트: [
    {
      id: '1',
      name: '폰트1',
      priceLabel: '100MC',
      description: '예쁜 손글씨 느낌의 폰트입니다.',
      price: 100,
      isOwned: false,
      releaseDate: '2025-07-20',
    },
    {
      id: '2',
      name: '폰트2',
      priceLabel: '무료',
      description: '귀여운 손글씨 느낌의 폰트입니다.',
      price: 0,
      isOwned: false,
      releaseDate: '2025-07-10',
    },
  ],
  편지지: [
    {
      id: '3',
      name: '편지지1',
      priceLabel: '보유중',
      description: '예쁜 느낌의 편지지입니다.',
      price: 100,
      isOwned: true,
      releaseDate: '2025-07-05',
    },
    {
      id: '4',
      name: '편지지2',
      priceLabel: '100MC',
      price: 100,
      releaseDate: '2025-07-15',
    },
    {
      id: '5',
      name: '편지지3',
      priceLabel: '무료',
      price: 0,
      releaseDate: '2025-06-30',
    },
    {
      id: '6',
      name: '편지지4',
      priceLabel: '150MC',
      price: 150,
      releaseDate: '2025-07-01',
    },
  ],
  우표: [
    {
      id: '7',
      name: '우표1',
      priceLabel: '무료',
      price: 0,
      releaseDate: '2025-06-15',
    },
    {
      id: '8',
      name: '우표2',
      priceLabel: '100MC',
      price: 100,
      releaseDate: '2025-07-25',
    },
    {
      id: '9',
      name: '우표3',
      priceLabel: '200MC',
      price: 200,
      releaseDate: '2025-07-18',
    },
  ],
  보관함: [
    { id: '10', name: '보관아이템1', priceLabel: '보유중' },
    { id: '11', name: '보관아이템2', priceLabel: '보유중' },
    { id: '12', name: '보관아이템3', priceLabel: '보유중' },
    { id: '13', name: '보관아이템4', priceLabel: '보유중' },
    { id: '14', name: '보관아이템5', priceLabel: '보유중' },
  ],
};

export const TabContent = ({ selectedTab, selectedOption, onItemClick }: TabContentProps) => {
  const items = dummyData[selectedTab] || [];

  // 정렬 기능
  const sortedItems = [...items].sort((a, b) => {
    switch (selectedOption) {
      case '높은 가격순':
        return (b.price ?? 0) - (a.price ?? 0);
      case '낮은 가격순':
        return (a.price ?? 0) - (b.price ?? 0);
      case '최신 출시':
        return new Date(b.releaseDate ?? '').getTime() - new Date(a.releaseDate ?? '').getTime();
      case '최초 출시':
        return new Date(a.releaseDate ?? '').getTime() - new Date(b.releaseDate ?? '').getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="relative px-2 pt-4 pb-28">
      <div className="grid grid-cols-2 gap-x-1 gap-y-4">
        {sortedItems.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            priceLabel={item.priceLabel}
            imageUrl={item.imageUrl}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};
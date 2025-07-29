import ItemCard from './ItemCard';

interface Item {
  id: string;
  name: string;
  priceLabel: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  isOwned?: boolean;
}

type TabContentProps = {
  selectedTab: keyof typeof dummyData;
  onItemClick: (item: Item) => void; // 🔹 추가된 props
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
    },
    {
      id: '2',
      name: '폰트2',
      priceLabel: '무료',
      description: '귀여운 손글씨 느낌의 폰트입니다.',
      price: 0,
      isOwned: false,
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
    },
    { id: '4', name: '편지지2', priceLabel: '100MC' },
    { id: '5', name: '편지지3', priceLabel: '무료' },
    { id: '6', name: '편지지4', priceLabel: '150MC' },
  ],
  우표: [
    { id: '7', name: '우표1', priceLabel: '무료' },
    { id: '8', name: '우표2', priceLabel: '100MC' },
    { id: '9', name: '우표3', priceLabel: '200MC' },
  ],
  보관함: [
    { id: '10', name: '보관아이템1', priceLabel: '보유중' },
    { id: '11', name: '보관아이템2', priceLabel: '보유중' },
    { id: '12', name: '보관아이템3', priceLabel: '보유중' },
    { id: '13', name: '보관아이템4', priceLabel: '보유중' },
    { id: '14', name: '보관아이템5', priceLabel: '보유중' },
    { id: '15', name: '보관아이템6', priceLabel: '보유중' },
    { id: '16', name: '보관아이템7', priceLabel: '보유중' },
  ],
};

export const TabContent = ({ selectedTab, onItemClick }: TabContentProps) => {
  const items = dummyData[selectedTab] || [];

  return (
    <div className="relative px-2 pt-4 pb-28">
      <div className="grid grid-cols-2 gap-x-1 gap-y-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            priceLabel={item.priceLabel}
            imageUrl={item.imageUrl}
            onClick={() => onItemClick(item)} // 🔹 외부에서 클릭 처리
          />
        ))}
      </div>
    </div>
  );
};
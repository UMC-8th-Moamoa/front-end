interface ItemCardProps {
  id: string; // 상세 보기나 클릭 시 필요
  name: string;
  priceLabel: string; // '100MC', '무료', '보유중' 등
  imageUrl?: string;
  onClick?: () => void; // 클릭 시 상세페이지 등
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  name,
  priceLabel,
  imageUrl,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (priceLabel) {
      case '100MC':
      case '무료':
        return 'text-[#6282E1]';
      case '보유중':
        return 'text-[#C7D5FF]';
      default:
        return 'text-[#6282E1]';
    }
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => {
        console.log(`Clicked item: ${name}`);
        onClick?.();
      }}
    >
      {/* 카드 본체 (이미지 + 이름) */}
      <div className="bg-white rounded-xl shadow-sm p-2 flex flex-col items-center w-43">
        <div className="w-full h-28 bg-white rounded-xl overflow-hidden mb-2 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div className="text-sm font-medium text-[#1F1F1F] truncate text-center">{name}</div>
      </div>

      {/* 가격은 카드 아래쪽 */}
      <div className={`mt-2 text-sm font-semibold ${getStatusColor()}`}>{priceLabel}</div>
    </div>
  );
};

export default ItemCard;
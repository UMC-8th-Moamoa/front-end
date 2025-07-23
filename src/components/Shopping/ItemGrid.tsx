const ItemGrid = () => {
  const dummyItems = Array.from({ length: 6 });

  return (
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
  );
};
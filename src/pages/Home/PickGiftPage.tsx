import { useState } from "react";

import Button from "../../components/common/Button";
import BottomNavigation from "../../components/common/BottomNavigation";
import WishListDummy from "../../components/WishList/WishListDummy";
import { PickGiftList } from "../../components/HomePage/PickGift/PickGiftList";

const PickGiftPage = () => {
  const [withMyMoney, setWithMyMoney] = useState(true);
  const [sortOption, setSortOption] = useState("등록순");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = ["등록순", "높은 가격순", "낮은 가격순"];

  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const sortedList = [...WishListDummy].sort((a, b) => {
    if (sortOption === "높은 가격순") return b.price - a.price;
    if (sortOption === "낮은 가격순") return a.price - b.price;
    return a.id - b.id; // 등록순은 id 기준
  });

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col items-center bg-[#8F8F8F] relative">
      {/* 상단 제목 */}
      <div className="w-full mt-5 max-w-[393px] px-4 pt-[12px]">
        <h2 className="text-center text-[16px] font-medium text-white">나의 모아모아</h2>
        <p className="text-center text-[40px] font-medium text-white">-10,000원</p>

        {/* 내 돈 보태기 체크박스 */}
        <label className="flex items-center gap-2 ml-4 mt-2">
          <input
            className="w-[20px] h-[20px] mr-1 appearance-none rounded-sm bg-white checked:bg-[url('/assets/GrayCheck.svg')] checked:bg-center checked:bg-no-repeat"
            type="checkbox"
            checked={withMyMoney}
            onChange={() => setWithMyMoney(!withMyMoney)}
          />
          <span className="text-[15px] font-medium text-white">내 돈 보태기</span>
        </label>
      </div>

      {/* 선물 리스트 컨테이너 */}
      <div className="bg-white mt-4 w-full max-w-[393px] rounded-t-[40px] px-4 pt-6 pb-[120px] overflow-hidden">
        {/* 헤더 + 정렬 옵션 */}
        <div className="flex items-center justify-between mb-2 relative">
          <div>
            <h3 className="text-[20px] font-semibold px-3 text-black leading-tight">내 선물 고르기</h3>
            <p className="text-[14px] px-3 mb-2 text-black mt-1">체크박스를 눌러 선물을 담으세요!</p>
          </div>

          {/* 드롭다운 */}
          <div className="relative w-[108px]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`border border-gray-400 rounded-[8px] px-[9px] py-[8px] text-sm w-full h-[32px] flex items-center justify-between ${
                isDropdownOpen ? "rounded-b-none" : ""
              }`}
            >
              {sortOption}
              <img
                src={isDropdownOpen ? "/assets/ChevronUp.svg" : "/assets/ChevronDown.svg"}
                className="w-[20px] h-[20px]"
                alt="toggle dropdown"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute top-[32px] left-0 w-full bg-white border-x border-b border-gray-400 rounded-b-[8px] z-10">
                {sortOptions.map((option) => (
                  <li
                    key={option}
                    className="px-[9px] py-[8px] text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 리스트 */}
        <PickGiftList items={sortedList} checkedItems={checkedItems} onChange={handleCheckboxChange} />
      </div>

      {/* 정산하기 버튼 */}
      <div className="absolute bottom-[58px] left-1/2 -translate-x-1/2 z-50 w-[350px] h-[44px]">
        <Button className="bg-gray-300">
          <div className="flex justify-between items-center w-full">
            <span className="text-[16px] text-black font-bold ml-33">정산하기</span>
            <span className="text-[12px] text-black">210,000원</span>
          </div>
        </Button>
      </div>

      {/* 바텀 네비게이션 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-40">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default PickGiftPage;

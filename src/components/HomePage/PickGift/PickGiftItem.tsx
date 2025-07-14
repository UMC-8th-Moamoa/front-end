import React from "react";

interface PickGiftItemProps {
  id: number;
  imageSrc: string;
  title: string;
  price: string;
  checked: boolean;
  onChange: (id: number) => void;
}

const PickGiftItem = ({ id, imageSrc, title, price, checked, onChange }: PickGiftItemProps) => {
  return (
    <div className="flex w-[350px] h-[121px] bg-white rounded-[14px] shadow-sm p-2 gap-2 items-center">
      {/* 이미지 */}
      <img
        src={imageSrc}
        alt={title}
        className="w-[105px] h-[105px] rounded-[10px] object-cover"
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col justify-between h-full py-3">
        <div className="text-[14px] text-black leading-[1.2]">
          {title.split(" ").map((word, idx) => (
            <React.Fragment key={idx}>
              {word}
              {idx !== title.split(" ").length - 1 && " "}
              {idx === 2 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="text-[20px] font-medium">{price}</div>
      </div>

      {/* 중앙선 + 체크박스 */}
      <div className="flex items-center h-full pt-1 pr-2">
        {/* 중앙 구분선 */}
        <div className="w-px h-[80px] bg-[#D9D9D9] mr-6" />

        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(id)}
          className="w-[20px] h-[20px] appearance-none rounded-sm border border-gray-400 checked:bg-[#6C4AB6] checked:border-[#6C4AB6] checked:bg-[url('/assets/WhiteCheck.svg')] checked:bg-center checked:bg-no-repeat"
        />
      </div>
    </div>
  );
};

export default PickGiftItem;

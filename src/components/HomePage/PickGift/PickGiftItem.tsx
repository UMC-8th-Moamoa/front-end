// components/HomePage/PickGift/PickGiftItem.tsx
import React from "react";
import WhiteCheck from "../../../assets/WhiteCheck.svg";

interface PickGiftItemProps {
  id: number;
  imageSrc: string;
  title: string;
  price: number;                 // ✅ string -> number
  checked: boolean;
  onChange: (id: number) => void;
}

const PickGiftItem = ({ id, imageSrc, title, price, checked, onChange }: PickGiftItemProps) => {
  return (
    <div className="flex w-[350px] h-[121px] bg-white rounded-[14px] shadow-sm p-2 gap-2 items-center">
      <img src={imageSrc} alt={title} className="w-[105px] h-[105px] rounded-[10px] object-cover" />

      <div className="flex flex-1 flex-col justify-between h-full py-3">
        <div className="text-[14px] text-black leading-[1.2]">
          {title.split(" ").map((word, idx, arr) => (
            <React.Fragment key={idx}>
              {word}
              {idx !== arr.length - 1 && " "}
              {idx === 2 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="text-[20px] font-medium">{price.toLocaleString()}원</div>
      </div>

      <div className="flex items-center h-full pt-1 pr-2">
        <div className="w-px h-[80px] bg-[#D9D9D9] mr-6" />
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(id)}
          className="w-[20px] h-[20px] appearance-none rounded-sm border border-gray-400 checked:bg-[#6C4AB6] checked:border-[#6C4AB6] bg-center bg-no-repeat"
          style={{ backgroundImage: checked ? `url(${WhiteCheck})` : undefined }}
        />
      </div>
    </div>
  );
};

export default PickGiftItem;
